import { error } from '@sveltejs/kit'
import { getEntries, getEntry, loadEntry } from '$lib/server/content'
import {
	getCanonicalPath,
	getCategoryMembers,
	sections,
	sectionsWithOwnChildRoutes
} from '$lib/wikiCategory'

export const entries = () => {
	const ids = new Set(getEntries().map(({ id }) => id))

	return sections
		.filter((section) => !sectionsWithOwnChildRoutes.includes(section))
		.flatMap((section) =>
			getCategoryMembers(section)
				.filter((child) => ids.has(child))
				.map((child) => ({ id: section, child }))
		)
}

export const load = ({ params }) => {
	if (getCanonicalPath(params.child) !== `/${params.id}/${params.child}`) error(404)

	const entry = getEntry(params.child)
	if (!entry) error(404)

	return loadEntry(entry)
}
