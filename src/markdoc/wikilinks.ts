import { readdirSync, readFileSync, type Dirent } from 'node:fs'
import { join } from 'node:path'
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

type PageInfo = { id: string; aliases: string[]; categories: string[]; section: boolean }

const toStrings = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : [])

const readPageInfo = (id: string, raw: string): PageInfo => {
	const frontmatter = readFrontmatter(raw) as {
		aliases?: unknown
		categories?: unknown
		section?: unknown
	} | null
	return {
		id,
		aliases: toStrings(frontmatter?.aliases),
		categories: toStrings(frontmatter?.categories),
		section: frontmatter?.section === true
	}
}

const readWikiPages = (wikiRoot: string): PageInfo[] => {
	let folders: Dirent[]
	try {
		folders = readdirSync(wikiRoot, { withFileTypes: true }).filter((entry) =>
			entry.isDirectory()
		)
	} catch {
		return []
	}

	return folders.flatMap((folder) => {
		const folderDir = join(wikiRoot, folder.name)
		return readdirSync(folderDir)
			.filter((file) => file.endsWith('.md'))
			.map((file) =>
				readPageInfo(
					file.replace(/\.md$/, ''),
					readFileSync(join(folderDir, file), 'utf-8')
				)
			)
	})
}

export const buildWikiIndex = (wikiRoot: string) => {
	const index = new Map<string, string>()
	const ids = new Map<string, string>()
	const aliasPaths: string[] = []

	const pages = readWikiPages(wikiRoot)
	const sectionIds = new Set(pages.filter((page) => page.section).map((page) => page.id))

	for (const page of pages) {
		const parent = page.categories.find((category) => sectionIds.has(category))
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

export const resolveWikiHref = (wikiIndex: Map<string, string>, permalink: string): string => {
	for (const prefix of externalPrefixes) {
		if (permalink.startsWith(prefix)) {
			return externalLinks[prefix].buildUrl(permalink.slice(prefix.length))
		}
	}

	return wikiIndex.get(permalink) ?? `/${permalink}`
}

export const resolveWikiPageName = (name: string): string => {
	if (externalPrefixes.some((prefix) => name.startsWith(prefix))) {
		return name
	}

	return toSlug(name)
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
	const exists = isExternal || wikiIndex.has(permalink)

	return { href, exists, displayText }
}

const WIKILINK_PATTERN = /\[\[(.+?)\]\]/g

export const buildLinkGraph = (wikiRoot: string) => {
	const { ids } = buildWikiIndex(wikiRoot)
	const edges = new Map<string, Set<string>>()

	let sections: Dirent[]
	try {
		sections = readdirSync(wikiRoot, { withFileTypes: true }).filter((entry) =>
			entry.isDirectory()
		)
	} catch {
		return edges
	}

	for (const section of sections) {
		const sectionDir = join(wikiRoot, section.name)
		const files = readdirSync(sectionDir).filter((file) => file.endsWith('.md'))

		for (const file of files) {
			const id = file.replace(/\.md$/, '')
			const raw = readFileSync(join(sectionDir, file), 'utf-8')
			const linked = new Set<string>()

			for (const match of raw.matchAll(WIKILINK_PATTERN)) {
				const name = match[1].split('|')[0].trim()
				const permalink = resolveWikiPageName(name)

				if (externalPrefixes.some((prefix) => permalink.startsWith(prefix))) continue

				const targetId = ids.get(permalink)
				if (targetId && targetId !== id) linked.add(targetId)
			}

			edges.set(id, linked)
		}
	}

	return edges
}
