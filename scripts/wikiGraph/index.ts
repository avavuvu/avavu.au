import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import slugify from 'slugify'
import type { z } from 'zod'
import { buildLinkGraph, readContentFiles, readFrontmatter } from '../../src/markdoc/wikilinks.ts'
import { fetchJsonCached } from '../../src/lib/server/externalCache.ts'
import { entrySchema, externalNewsletterListSchema } from '../../src/lib/schema.ts'
import type { Backlinks, GraphData, Patrons } from '../../src/lib/index.ts'
import { labelWidth } from '../../src/lib/graphLabel.ts'
import { layoutGraph } from './layout.ts'
import { fetchPaidPatrons } from './patreon.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const contentRoot = join(root, 'src/content')
const outPath = join(root, 'src/lib/wikiGraph.json')
const backlinksPath = join(root, 'src/lib/server/wikiBacklinks.json')
const patronsPath = join(root, 'src/lib/server/patrons.json')

const PATREON_PAGE = 'patreon'
const PATRON_ID_PREFIX = 'patron-'

const reservedIds = ['archive', 'random', 'graph', 'api']

const errors: string[] = []
const fail = (file: string, message: string) => errors.push(`${relative(root, file)}: ${message}`)
const failZod = (file: string, error: z.ZodError) => {
	for (const issue of error.issues) {
		fail(file, `${issue.path.join('.') || 'frontmatter'} — ${issue.message}`)
	}
}

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

type GraphMeta = {
	title: string
	aliases?: string[]
	categories?: string[]
	section?: true
}
type Page = { id: string; file: string; meta: GraphMeta }
const pages = new Map<string, Page>()

for (const { id, file, raw } of readContentFiles(contentRoot)) {
	if (pages.has(id))
		fail(file, `page id "${id}" is also used by ${relative(root, pages.get(id)!.file)}`)
	if (reservedIds.includes(id)) fail(file, `"${id}" is a reserved id`)

	const result = entrySchema.safeParse(readFrontmatter(raw) ?? {})
	if (result.success) pages.set(id, { id, file, meta: result.data })
	else failZod(file, result.error)
}

const newsletterIds: string[] = []
const titles: Record<string, string> = {}

const externalNewsletters = await fetchJsonCached(
	'https://ava.room.lc/api/newsletters',
	'newsletters-list',
	externalNewsletterListSchema,
	[]
)

for (const { slug, title } of externalNewsletters) {
	if (pages.has(slug))
		fail(pages.get(slug)!.file, `"${slug}" exists locally and in the newsletter API`)
	newsletterIds.push(slug)
	titles[slug] = title
}

for (const page of pages.values()) titles[page.id] = page.meta.title

const paidPatrons = await fetchPaidPatrons()
if (paidPatrons === null) {
	console.warn('PATREON_CREATOR_TOKEN is not set, so the build has no Patreon supporters.')
}

const patrons: Patrons = {}
for (const { name, tier } of paidPatrons ?? []) {
	const base = toSlug(name) || 'supporter'
	let slug = base
	for (let n = 2; slug in patrons; n++) slug = `${base}-${n}`
	patrons[slug] = { id: `${PATRON_ID_PREFIX}${slug}`, name, tier }
}

if (Object.keys(patrons).length > 0 && !pages.has(PATREON_PAGE)) {
	fail(contentRoot, `there are Patreon supporters, but no "${PATREON_PAGE}" page`)
}
for (const page of pages.values()) {
	if (page.id.startsWith(PATRON_ID_PREFIX))
		fail(page.file, `page ids cannot start with "${PATRON_ID_PREFIX}"`)
}

const sections = [...pages.values()].filter(({ meta }) => meta.section).map(({ id }) => id)

const aliasOwners = new Map<string, string>()

for (const page of pages.values()) {
	for (const alias of page.meta.aliases ?? []) {
		const slug = toSlug(alias)
		if (pages.has(slug) && slug !== page.id)
			fail(page.file, `alias "${alias}" is the id of another page`)
		if (reservedIds.includes(slug)) fail(page.file, `alias "${alias}" is a reserved id`)
		const owner = aliasOwners.get(slug)
		if (owner && owner !== page.id)
			fail(page.file, `alias "${alias}" is also an alias of "${owner}"`)
		aliasOwners.set(slug, page.id)
	}
}

const resolvePageId = (name: string) => {
	const slug = toSlug(name)
	return pages.has(slug) ? slug : aliasOwners.get(slug)
}

for (const page of pages.values()) {
	const resolved: string[] = []
	for (const category of page.meta.categories ?? []) {
		const id = resolvePageId(category)
		if (!id) fail(page.file, `category "${category}" has no page`)
		else if (id === page.id) fail(page.file, 'a page cannot be in its own category')
		else if (!resolved.includes(id)) resolved.push(id)
	}
	page.meta.categories = resolved

	const pageSections = resolved.filter((category) => sections.includes(category))
	if (pageSections.length > 1)
		fail(page.file, `in more than one section: ${pageSections.join(', ')}`)
	if (page.meta.section && pageSections.length > 0)
		fail(page.file, 'a section cannot be in a section')
}

if (errors.length > 0) {
	console.error(`\nContent validation failed (${errors.length}):\n`)
	for (const error of errors) console.error(`  ${error}`)
	console.error('')
	process.exit(1)
}

const categories: Record<string, string[]> = {}
for (const page of pages.values()) {
	for (const category of page.meta.categories ?? []) {
		;(categories[category] ??= []).push(page.id)
	}
}
categories.newsletter = [...(categories.newsletter ?? []), ...newsletterIds]

const patronIds = Object.values(patrons).map(({ id }) => id)
if (patronIds.length > 0) {
	categories[PATREON_PAGE] = [...(categories[PATREON_PAGE] ?? []), ...patronIds]
}

const edgeKeys = new Set<string>()
const edgeList: Array<[string, string]> = []
const addEdge = (from: string, to: string) => {
	const key = `${from}\u0000${to}`
	if (from === to || edgeKeys.has(key)) return
	edgeKeys.add(key)
	edgeList.push([from, to])
}

const backlinks: Backlinks = {}

for (const [from, targets] of buildLinkGraph(contentRoot)) {
	for (const to of targets) {
		addEdge(from, to)
		;(backlinks[to] ??= []).push(from)
	}
}
for (const [category, members] of Object.entries(categories)) {
	for (const member of members) addEdge(member, category)
}

const paths: Record<string, string> = {}
for (const page of pages.values()) {
	const section = (page.meta.categories ?? []).find((category) => sections.includes(category))
	paths[page.id] = section ? `/${section}/${page.id}` : `/${page.id}`
}
for (const id of newsletterIds) paths[id] = `/newsletter/${id}`
for (const [slug, { id, name }] of Object.entries(patrons)) {
	paths[id] = `/patreon/${slug}`
	titles[id] = name
}

const { crossings, ...layout } = layoutGraph(
	[...pages.keys(), ...newsletterIds, ...patronIds],
	edgeList,
	(id) => labelWidth(titles[id] ?? id),
	([from, to]) => (categories[to] ?? []).includes(from)
)
console.log(
	`Graph: ${layout.nodeIds.length} nodes, ${edgeList.length} edges, ${crossings} crossings`
)

const pageCategories: Record<string, string[]> = {}
for (const [category, members] of Object.entries(categories)) {
	for (const member of members) (pageCategories[member] ??= []).push(category)
}
for (const page of pages.values()) {
	if (page.meta.categories?.length) pageCategories[page.id] = page.meta.categories
}

const graph: GraphData = { ...layout, titles, categories, pageCategories, sections, paths }

await writeFile(outPath, JSON.stringify(graph))
await writeFile(backlinksPath, JSON.stringify(backlinks))
await writeFile(patronsPath, JSON.stringify(patrons))
