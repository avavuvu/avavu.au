import type { Component } from 'svelte'

export type { Frontmatter, WikiFrontmatter, ArchiveFrontmatter, MarkdownFrontmatter } from '../markdoc/types.ts'

export const categoryKeys = [
	'newsletter',
	'games',
	'web',
	'writing',
	'projects',
	'bio',
	'people',
	'glossary'
] as const
export type CategoryKey = (typeof categoryKeys)[number]

export type NewsletterData = {
	title: string
	date: string
	preheader: string
	crosswords?: Array<{
		info: string
		vendor: string
		link: string
		date: string
	}>
	cool?: Array<{
		title: string
		info: string
		links: string[]
	}>
	music?: Array<{
		title: string
		info: string
		link: string
	}>
}

export interface MarkdownEntry<M = Record<string, unknown>> {
	default: Component
	metadata: M
}

const entryKind: Partial<Record<CategoryKey, 'wiki' | 'archive'>> = {
	projects: 'archive',
	bio: 'wiki',
	people: 'wiki',
	glossary: 'wiki'
}

const content = import.meta.glob<unknown>(['/src/content/**/*.md', '/src/wiki/**/*.md'], {
	eager: true
})
const rawContent = import.meta.glob<string>(['/src/content/**/*.md', '/src/wiki/**/*.md'], {
	eager: true,
	query: '?raw',
	import: 'default'
})

const extractPlaintext = (markdown: string): string => {
	return markdown
		.replace(/---[\s\S]*?---/, '') // strip frontmatter
		.replace(/!\[.*?\]\(.*?\)/g, '') // strip images
		.replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
		.replace(/#{1,6}\s+/g, '') // strip headings
		.replace(/[*_`~]/g, '') // strip emphasis
		.replace(/\n+/g, ' ') // collapse newlines
		.trim()
}

const extractFirstImage = (markdown: string): string | null => {
	const match = markdown.match(/!\[.*?\]\((.*?)\)/)
	return match?.[1] ?? null
}

export const getMarkdownContent = <T extends MarkdownEntry>(
	searchCategory: CategoryKey
): Array<{
	id: string
	path: string
	category: string
	data: T
	plainText: string
	firstImage: string | null
	rawMarkdown: string
}> => {
	const kind = entryKind[searchCategory]

	return Object.entries(content)
		.filter(([path]) => path.split('/').at(-2) === searchCategory)
		.map(([path, data]) => {
			const id = path.split('/').at(-1)!.replace('.md', '')
			const raw = rawContent[path] ?? ''
			const entry = data as MarkdownEntry

			let metadata: unknown = entry.metadata
			if (kind) {
				metadata = { ...entry.metadata, kind }
			}

			return {
				id,
				path,
				category: searchCategory,
				data: { ...entry, metadata } as T,
				plainText: extractPlaintext(raw),
				firstImage: extractFirstImage(raw),
				rawMarkdown: raw.replace(/^---[\s\S]*?---\n?/, '').trim()
			}
		})
}

export const getMarkdownEntry = <T extends MarkdownEntry>(
	category: CategoryKey,
	searchId: string
) => {
	const content = getMarkdownContent<T>(category)

	const match = content.find(({ id }) => id === searchId)

	return match
}
