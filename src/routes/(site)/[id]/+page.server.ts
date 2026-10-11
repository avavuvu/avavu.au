import { error, redirect } from '@sveltejs/kit'
import slugify from 'slugify'
import { getPageLinks, getWikiEntries } from '$lib/server/content'
import { getCanonicalPath, getCategoryNodeIds, isCategory, staticRoutes } from '$lib/wikiCategory'

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

export const entries = () => {
	const ids = new Set<string>()

	for (const entry of getWikiEntries()) {
		if (!staticRoutes.includes(entry.id)) ids.add(entry.id)

		for (const alias of entry.metadata.aliases ?? []) {
			const slug = toSlug(alias)
			if (!staticRoutes.includes(slug)) ids.add(slug)
		}
	}

	return [...ids].map((id) => ({ id }))
}

export const load = ({ params }) => {
	const entries = getWikiEntries()

	const entry = entries.find((work) => work.id === params.id)
	if (entry) {
		const category = isCategory(entry.id)
		return {
			entry,
			...getPageLinks(entry.id),
			current: entry.id,
			highlighted: category ? getCategoryNodeIds(entry.id) : null,
			canonical: getCanonicalPath(entry.id)
		}
	}

	const aliasTarget = entries.find((work) =>
		(work.metadata.aliases ?? []).some((alias) => toSlug(alias) === params.id)
	)
	if (aliasTarget) redirect(308, getCanonicalPath(aliasTarget.id))

	error(404)
}
