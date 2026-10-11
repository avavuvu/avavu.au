import { essaySlug, getMarkdocContent } from '$lib/server/markdoc'
import { getPageLinks, getWikiEntry } from '$lib/server/content'
import { getCategoryNodeIds } from '$lib/wikiCategory'

export const load = () => {
	const members = getMarkdocContent()
		.map(({ id, data }) => ({
			href: `/essays/${essaySlug(id)}`,
			title: data.metadata.title,
			date: data.metadata.date
		}))
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(({ href, title }) => ({ href, title }))

	return {
		entry: getWikiEntry('essays')!,
		...getPageLinks('essays', members),
		current: 'essays',
		highlighted: getCategoryNodeIds('essays')
	}
}
