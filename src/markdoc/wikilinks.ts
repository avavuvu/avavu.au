import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import yaml from 'js-yaml'
import slugify from 'slugify'

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

export const readFrontmatter = (raw: string): unknown => {
	const match = raw.match(/^---\n([\s\S]*?)\n---/)
	if (!match) return null

	try {
		return yaml.load(match[1]) ?? {}
	} catch {
		return null
	}
}

type PageInfo = {
	id: string
	raw: string
	aliases: string[]
	categories: string[]
	section: boolean
}

const toStrings = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : [])

const readPageInfo = (id: string, raw: string): PageInfo => {
	const frontmatter = readFrontmatter(raw) as {
		aliases?: unknown
		categories?: unknown
		section?: unknown
	} | null
	return {
		id,
		raw,
		aliases: toStrings(frontmatter?.aliases),
		categories: toStrings(frontmatter?.categories),
		section: frontmatter?.section === true
	}
}

export const readContentFiles = (contentRoot: string) => {
	let files: string[]
	try {
		files = readdirSync(contentRoot, { recursive: true, encoding: 'utf-8' })
	} catch {
		return []
	}

	return files
		.filter((file) => file.endsWith('.md'))
		.sort()
		.map((file) => ({
			id: basename(file, '.md'),
			file: join(contentRoot, file),
			raw: readFileSync(join(contentRoot, file), 'utf-8')
		}))
}

const readWikiPages = (contentRoot: string): PageInfo[] =>
	readContentFiles(contentRoot).map(({ id, raw }) => readPageInfo(id, raw))

export const buildWikiIndex = (contentRoot: string) => {
	const index = new Map<string, string>()
	const ids = new Map<string, string>()
	const aliasPaths: string[] = []

	const pages = readWikiPages(contentRoot)
	const sectionIds = new Set(pages.filter((page) => page.section).map((page) => page.id))

	const pageIds = new Map<string, string>()
	for (const page of pages) {
		for (const alias of page.aliases) pageIds.set(toSlug(alias), page.id)
	}
	for (const page of pages) pageIds.set(toSlug(page.id), page.id)

	for (const page of pages) {
		const parent = page.categories
			.map((category) => pageIds.get(toSlug(category)))
			.find((category) => category !== undefined && sectionIds.has(category))
		const href = parent ? `/${parent}/${page.id}` : `/${page.id}`

		index.set(toSlug(page.id), href)
		ids.set(toSlug(page.id), page.id)

		for (const alias of page.aliases) {
			const aliasSlug = toSlug(alias)
			if (aliasSlug === toSlug(page.id)) continue
			index.set(aliasSlug, href)
			ids.set(aliasSlug, page.id)
			aliasPaths.push(`/${aliasSlug}`)
		}
	}

	return { index, ids, aliasPaths }
}

const externalUrl = (base: string) => (name: string) => `${base}${name.trim().replace(/\s+/g, '_')}`

type ExternalLink = {
	buildUrl: (name: string) => string
	formatDisplay?: (name: string) => string
}

const externalLinks: Record<string, ExternalLink> = {
	'WP:': { buildUrl: externalUrl('https://en.wikipedia.org/wiki/') },
	'WT:': { buildUrl: externalUrl('https://en.wiktionary.org/wiki/') },
	'IG:': {
		buildUrl: externalUrl('https://instagram.com/'),
		formatDisplay: (name) => `@${name.trim()}`
	}
}

const externalPrefixes = Object.keys(externalLinks)

export const isExternalWikiLink = (name: string) =>
	externalPrefixes.some((prefix) => name.trim().startsWith(prefix))

export const splitHash = (permalink: string): [string, string] => {
	const index = permalink.indexOf('#')
	return index < 0 ? [permalink, ''] : [permalink.slice(0, index), permalink.slice(index)]
}

export const resolveWikiHref = (wikiIndex: Map<string, string>, permalink: string): string => {
	for (const prefix of externalPrefixes) {
		if (permalink.startsWith(prefix)) {
			return externalLinks[prefix].buildUrl(permalink.slice(prefix.length))
		}
	}

	const [page, hash] = splitHash(permalink)
	return (wikiIndex.get(page) ?? `/${page}`) + hash
}

export const resolveWikiPageName = (name: string): string => {
	if (externalPrefixes.some((prefix) => name.startsWith(prefix))) {
		return name
	}

	const [page, hash] = splitHash(name)
	return toSlug(page) + (hash ? `#${toSlug(hash.slice(1))}` : '')
}

export const defaultWikiDisplayText = (name: string): string => {
	for (const prefix of externalPrefixes) {
		if (name.startsWith(prefix)) {
			const display = name.slice(prefix.length)

			return externalLinks[prefix]?.formatDisplay?.(display) ?? display
		}
	}

	return name
}

type BracketMatch = {
	href: string
	exists: boolean
	displayText: string
}

const resolveDisplayText = (name: string, aliasPart: string | undefined): string => {
	if (aliasPart !== undefined) {
		return aliasPart.trim()
	}

	return defaultWikiDisplayText(name)
}

export const resolveBracketContent = (
	wikiIndex: Map<string, string>,
	raw: string
): BracketMatch => {
	const [namePart, aliasPart] = raw.split('|')
	const name = namePart.trim()
	const displayText = resolveDisplayText(name, aliasPart)

	const permalink = resolveWikiPageName(name)
	const href = resolveWikiHref(wikiIndex, permalink)
	const isExternal = externalPrefixes.some((prefix) => permalink.startsWith(prefix))
	const exists = isExternal || wikiIndex.has(splitHash(permalink)[0])

	return { href, exists, displayText }
}

const WIKILINK_PATTERN = /\[\[(.+?)\]\]/g

export const buildLinkGraph = (contentRoot: string) => {
	const { ids } = buildWikiIndex(contentRoot)
	const edges = new Map<string, Set<string>>()

	for (const { id, raw } of readWikiPages(contentRoot)) {
		const linked = new Set<string>()

		for (const match of raw.matchAll(WIKILINK_PATTERN)) {
			const name = match[1].split('|')[0].trim()
			const permalink = resolveWikiPageName(name)

			if (externalPrefixes.some((prefix) => permalink.startsWith(prefix))) continue

			const targetId = ids.get(splitHash(permalink)[0])
			if (targetId && targetId !== id) linked.add(targetId)
		}

		edges.set(id, linked)
	}

	return edges
}
