import { error, redirect } from '@sveltejs/kit'
import slugify from 'slugify'
import { getEntries, loadEntry } from '$lib/server/content'
import { getCanonicalPath, staticRoutes } from '$lib/wikiCategory'

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

export const entries = () => {
	const ids = new Set<string>()

	for (const entry of getEntries()) {
		if (!staticRoutes.includes(entry.id)) ids.add(entry.id)

		for (const alias of entry.metadata.aliases ?? []) {
			const slug = toSlug(alias)
			if (!staticRoutes.includes(slug)) ids.add(slug)
		}
	}

	return [...ids].map((id) => ({ id }))
}

export const load = ({ params }) => {
	const entries = getEntries()

	const entry = entries.find((candidate) => candidate.id === params.id)
	if (entry) return loadEntry(entry)

	const aliasTarget = entries.find((candidate) =>
		(candidate.metadata.aliases ?? []).some((alias) => toSlug(alias) === params.id)
	)
	if (aliasTarget) redirect(308, getCanonicalPath(aliasTarget.id))

	error(404)
}
