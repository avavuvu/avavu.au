import { error } from '@sveltejs/kit'
import type { Newsletter } from '$lib'
import { externalNewsletterSchema } from '$lib/schema'
import { getNewsletter } from '$lib/server/content'
import { fetchJsonCached } from '$lib/server/externalCache'
import { getCategoryMembers, getCategoryNodeIds } from '$lib/wikiCategory'
import { marked } from 'marked'

export const entries = () => getCategoryMembers('newsletter').map((id) => ({ id }))

export const load = async ({ params }) => {
	const base = {
		current: params.id,
		highlighted: getCategoryNodeIds('newsletter'),
		canonical: `/newsletter/${params.id}`
	}

	const local = getNewsletter(params.id)

	if (local) {
		return {
			...base,
			metadata: local.metadata,
			path: local.path as string | null,
			html: null,
			slug: null
		}
	}

	const data = await fetchJsonCached(
		`https://ava.room.lc/api/newsletters/${params.id}`,
		`newsletter-${params.id}`,
		externalNewsletterSchema,
		null
	)

	if (!data) error(404)

	return {
		...base,
		metadata: { title: data.title, date: data.date, preheader: data.subtitle } as Newsletter,
		path: null as string | null,
		html: await marked.parse(data.content),
		slug: data.slug
	}
}
