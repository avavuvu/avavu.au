import { error, redirect } from '@sveltejs/kit'
import { externalNewsletterSchema } from '$lib/schema'
import {
	aliasSlugsOf,
	getEntriesIn,
	getEntry,
	getEntryByAlias,
	getPageLinks,
	loadEntry
} from '$lib/server/content'
import { fetchJsonCached } from '$lib/server/externalCache'
import { getCanonicalPath, getCategoryMembers, getCategoryNodeIds } from '$lib/wikiCategory'
import { marked } from 'marked'

export const entries = () =>
	[...getCategoryMembers('newsletter'), ...aliasSlugsOf(getEntriesIn('newsletter'))].map(
		(id) => ({ id })
	)

export const load = async ({ params }) => {
	const entry = getEntry(params.id)
	if (entry) return { ...loadEntry(entry), external: null }

	const aliasTarget = getEntryByAlias(params.id, getEntriesIn('newsletter'))
	if (aliasTarget) redirect(308, getCanonicalPath(aliasTarget.id))

	const data = await fetchJsonCached(
		`https://ava.room.lc/api/newsletters/${params.id}`,
		`newsletter-${params.id}`,
		externalNewsletterSchema,
		null
	)

	if (!data) error(404)

	return {
		entry: null,
		current: params.id,
		categories: getPageLinks(params.id).categories,
		highlighted: getCategoryNodeIds('newsletter'),
		canonical: `/newsletter/${params.id}`,
		external: {
			title: data.title,
			date: data.date,
			preheader: data.subtitle,
			html: await marked.parse(data.content),
			slug: data.slug
		}
	}
}
