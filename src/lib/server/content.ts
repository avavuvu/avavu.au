import type { Backlinks, ContentEntry, Entry, Member } from '$lib'
import { entrySchema } from '$lib/schema'
import {
	getCanonicalPath,
	getCategoriesOf,
	getCategoryMembers,
	getCategoryNodeIds,
	isCategory,
	sections
} from '$lib/wikiCategory'
import rawBacklinks from './wikiBacklinks.json'

const backlinks = rawBacklinks as Backlinks

const metadataModules = import.meta.glob<unknown>('/src/content/**/*.md', {
	eager: true,
	import: 'metadata'
})

const rawModules = import.meta.glob<string>('/src/content/**/*.md', {
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

let cache: ContentEntry<Entry>[] | null = null

export const getEntries = (): ContentEntry<Entry>[] =>
	(cache ??= Object.entries(metadataModules).map(([path, metadata]) => {
		const parsed = entrySchema.safeParse(metadata ?? {})
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
	}))

export const getEntry = (id: string) => getEntries().find((entry) => entry.id === id)

export const getEntriesIn = (category: string) =>
	getEntries()
		.filter(({ id }) => getCategoriesOf(id).includes(category))
		.sort((a, b) => (b.metadata.date ?? '').localeCompare(a.metadata.date ?? ''))

export const hasSidenotes = (path: string) => (rawModules[path] ?? '').includes('<Sidenote')

export const getRawMarkdown = (path: string) =>
	(rawModules[path] ?? '').replace(/^---[\s\S]*?---\n?/, '').trim()

export const getMembers = (category: string): Member[] =>
	getCategoryMembers(category)
		.map(getEntry)
		.filter((entry) => entry !== undefined)
		.map(({ id, metadata }) => ({
			href: getCanonicalPath(id),
			title: metadata.title,
			date: metadata.date ?? ''
		}))
		.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
		.map(({ href, title }) => ({ href, title }))

const toLinks = (ids: string[]): Member[] =>
	ids
		.map(getEntry)
		.filter((entry) => entry !== undefined)
		.map(({ id, metadata }) => ({ href: getCanonicalPath(id), title: metadata.title }))

export const getPageLinks = (id: string, members?: Member[]) => ({
	members: members ?? (isCategory(id) ? getMembers(id) : []),
	categories: toLinks(getCategoriesOf(id)),
	backlinks: toLinks(backlinks[id] ?? []).sort((a, b) => a.title.localeCompare(b.title))
})

export const sectionOf = (id: string) =>
	getCategoriesOf(id).find((category) => sections.includes(category))

export const loadEntry = (entry: ContentEntry<Entry>) => {
	const section = sectionOf(entry.id)
	return {
		entry,
		...getPageLinks(entry.id),
		current: entry.id,
		highlighted: isCategory(entry.id)
			? getCategoryNodeIds(entry.id)
			: section
				? getCategoryNodeIds(section)
				: null,
		canonical: getCanonicalPath(entry.id),
		wide: entry.metadata.layout === 'longform' && hasSidenotes(entry.path)
	}
}
