import { readdirSync, readFileSync, type Dirent } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'
import slugify from 'slugify'
import type { Frontmatter } from './types'

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

const readFrontmatter = (raw: string): Frontmatter | null => {
	const match = raw.match(/^---\n([\s\S]*?)\n---/)
	if (!match) return null

	try {
		return (yaml.load(match[1]) as Frontmatter) ?? {}
	} catch {
		return null
	}
}

export const buildWikiIndex = (wikiRoot: string) => {
	const index = new Map<string, string>()
	const aliasPaths: string[] = []

	let sections: Dirent[]
	try {
		sections = readdirSync(wikiRoot, { withFileTypes: true }).filter((entry) =>
			entry.isDirectory()
		)
	} catch {
		return { index, aliasPaths }
	}

	for (const section of sections) {
		const sectionDir = join(wikiRoot, section.name)
		const files = readdirSync(sectionDir).filter((file) => file.endsWith('.md'))

		for (const file of files) {
			const id = file.replace(/\.md$/, '')
			const frontmatter = readFrontmatter(readFileSync(join(sectionDir, file), 'utf-8'))

			const href = `/wiki/${id}`

			index.set(toSlug(id), href)

			if (Array.isArray(frontmatter?.aliases)) {
				for (const alias of frontmatter.aliases) {
					const aliasSlug = toSlug(String(alias))
					index.set(aliasSlug, href)
					aliasPaths.push(`/wiki/${aliasSlug}`)
				}
			}
		}
	}

	return { index, aliasPaths }
}

const externalUrl = (base: string) => (name: string) =>
	`${base}${name.trim().replace(/\s+/g, '_')}`

type ExternalLink = {
	buildUrl: (name: string) => string
	formatDisplay?: (name: string) => string
}

const externalLinks: Record<string, ExternalLink> = {
	'WP:': { buildUrl: externalUrl('https://en.wikipedia.org/wiki/')},
	'WT:': { buildUrl: externalUrl('https://en.wiktionary.org/wiki/')},
	'IG:': {
		buildUrl: externalUrl('https://instagram.com/'),
		formatDisplay: (name) => `@${name.trim()}`
	}
}

const externalPrefixes = Object.keys(externalLinks)

export const resolveWikiHref = (wikiIndex: Map<string, string>, permalink: string): string => {
	for (const prefix of externalPrefixes) {
		if (permalink.startsWith(prefix)) {
			return externalLinks[prefix].buildUrl(permalink.slice(prefix.length))
		}
	}

	return wikiIndex.get(permalink) ?? `/wiki/${permalink}`
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

            return externalLinks[prefix]
                ?.formatDisplay
                ?.(display)
                    ?? display
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
	const { index } = buildWikiIndex(wikiRoot)
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

				const href = index.get(permalink)
				if (!href) continue

				const targetId = href.replace('/wiki/', '')
				if (targetId !== id) linked.add(targetId)
			}

			edges.set(id, linked)
		}
	}

	return edges
}
