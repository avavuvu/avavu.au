import type { Component } from 'svelte'

export const categoryKeys = ['newsletter', 'games', 'archive', 'web', 'writing'] as const
export type CategoryKey = (typeof categoryKeys)[number]

export interface MarkdownEntry<M = Record<string, unknown>> {
	default: Component
	metadata: M
}

const content = import.meta.glob<unknown>(`/src/content/**/*.md`, {
	eager: true
})
const rawContent = import.meta.glob<string>('/src/content/**/*.md', {
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
}> => {
	return Object.entries(content)
		.map(([path, data]) => {
			const id = path.split('/').at(-1)!.replace('.md', '')
			const category = path.split('/').at(-2)!

			const raw = rawContent[path] ?? ''

			return {
				id,
				path,
				category,
				data: data as T,
				plainText: extractPlaintext(raw),
				firstImage: extractFirstImage(raw)
			}
		})
		.filter(({ category }) => category === searchCategory)
}

export const getMarkdownEntry = <T extends MarkdownEntry>(
	category: CategoryKey,
	searchId: string
) => {
	const content = getMarkdownContent<T>(category)

	const match = content.find(({ id }) => id === searchId)!

	return match
}
