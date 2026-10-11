import type { z } from 'zod'
import type { Backlinks, ContentEntry, Member, Newsletter, WikiMeta } from '$lib'
import { newsletterSchema, wikiFolders, wikiFolderSchemas, type WikiFolder } from '$lib/schema'
import { getCanonicalPath, getCategoryMembers, isCategory } from '$lib/wikiCategory'
import rawBacklinks from './wikiBacklinks.json'

const backlinks = rawBacklinks as Backlinks

const metadataModules = import.meta.glob<unknown>(['/src/content/**/*.md', '/src/wiki/**/*.md'], {
	eager: true,
	import: 'metadata'
})

const rawModules = import.meta.glob<string>(['/src/content/**/*.md', '/src/wiki/**/*.md'], {
	eager: true,
	query: '?raw',
	import: 'default'
})

const extractPlaintext = (markdown: string) =>
	markdown
		.replace(/---[\s\S]*?---/, '')
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
		.replace(/#{1,6}\s+/g, '')
		.replace(/[*_`~]/g, '')
		.replace(/\n+/g, ' ')
		.trim()

const extractFirstImage = (markdown: string) => markdown.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? null

const load = <S extends z.ZodType>(folder: string, schema: S): ContentEntry<z.output<S>>[] =>
	Object.entries(metadataModules)
		.filter(([path]) => path.split('/').at(-2) === folder)
		.map(([path, metadata]) => {
			const parsed = schema.safeParse(metadata ?? {})
			if (!parsed.success) {
				throw new Error(
					`${path}: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`
				)
			}

			const raw = rawModules[path] ?? ''
			return {
				id: path.split('/').at(-1)!.replace('.md', ''),
				path,
				metadata: parsed.data,
				plainText: extractPlaintext(raw),
				firstImage: extractFirstImage(raw)
			}
		})

let wikiCache: ContentEntry<WikiMeta>[] | null = null

export const getWikiEntries = (folder?: WikiFolder): ContentEntry<WikiMeta>[] => {
	wikiCache ??= wikiFolders.flatMap((name) => load(name, wikiFolderSchemas[name]))
	return folder ? wikiCache.filter(({ path }) => path.split('/').at(-2) === folder) : wikiCache
}

export const getWikiEntry = (id: string) => getWikiEntries().find((entry) => entry.id === id)

let newsletterCache: ContentEntry<Newsletter>[] | null = null

export const getNewsletters = () => (newsletterCache ??= load('newsletter', newsletterSchema))

export const getNewsletter = (id: string) => getNewsletters().find((entry) => entry.id === id)

export const getRawMarkdown = (path: string) =>
	(rawModules[path] ?? '').replace(/^---[\s\S]*?---\n?/, '').trim()

export const getMembers = (category: string): Member[] => {
	const entries = getWikiEntries()

	return getCategoryMembers(category)
		.map((id) => entries.find((entry) => entry.id === id))
		.filter((entry) => entry !== undefined)
		.map(({ id, metadata }) => ({
			href: getCanonicalPath(id),
			title: metadata.title,
			date: metadata.kind === 'archive' ? metadata.date : ''
		}))
		.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
		.map(({ href, title }) => ({ href, title }))
}

const toLinks = (ids: string[]): Member[] =>
	ids
		.map(getWikiEntry)
		.filter((entry) => entry !== undefined)
		.map(({ id, metadata }) => ({ href: getCanonicalPath(id), title: metadata.title }))

export const getPageLinks = (id: string, members?: Member[]) => {
	const entry = getWikiEntry(id)

	return {
		members: members ?? (isCategory(id) ? getMembers(id) : []),
		categories: toLinks(entry?.metadata.categories ?? []),
		backlinks: toLinks(backlinks[id] ?? []).sort((a, b) => a.title.localeCompare(b.title))
	}
}
