import { getMarkdownContent, type MarkdownEntry, type MarkdownFrontmatter } from '$lib'

export const prerender = true

const sectionKeys = ['projects', 'bio', 'people', 'glossary'] as const

type WikiEntry = MarkdownEntry<MarkdownFrontmatter>

export const load = () => {
	const ids = sectionKeys.flatMap((section) =>
		getMarkdownContent<WikiEntry>(section).map((entry) => entry.id)
	)

	return { ids }
}
