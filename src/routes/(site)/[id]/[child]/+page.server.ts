import { error } from '@sveltejs/kit'
import { getPageLinks, getWikiEntries, getWikiEntry } from '$lib/server/content'
import {
	getCanonicalPath,
	getCategoryMembers,
	getCategoryNodeIds,
	sections,
	sectionsWithOwnChildRoutes
} from '$lib/wikiCategory'

export const entries = () => {
	const wikiIds = new Set(getWikiEntries().map(({ id }) => id))

	return sections
		.filter((section) => !sectionsWithOwnChildRoutes.includes(section))
		.flatMap((section) =>
			getCategoryMembers(section)
				.filter((child) => wikiIds.has(child))
				.map((child) => ({ id: section, child }))
		)
}

export const load = ({ params }) => {
	const canonical = `/${params.id}/${params.child}`
	if (getCanonicalPath(params.child) !== canonical) error(404)

	const entry = getWikiEntry(params.child)
	if (!entry) error(404)

	return {
		entry,
		...getPageLinks(entry.id),
		current: entry.id,
		highlighted: getCategoryNodeIds(params.id),
		canonical
	}
}
