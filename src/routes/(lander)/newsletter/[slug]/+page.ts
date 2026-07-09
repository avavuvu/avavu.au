import { getMarkdownContent, getMarkdownEntry, type MarkdownEntry, type NewsletterData } from '$lib'
import type { ExternalNewsletter } from '../+layout.server'

export const prerender = true

type Newsletter = MarkdownEntry<NewsletterData>

export const entries = async () => {
	const local = getMarkdownContent<Newsletter>('newsletter').map(({ id }) => ({ slug: id }))

	try {
		const res = await fetch('https://ava.room.lc/api/newsletters')
		if (res.ok) {
			const external: ExternalNewsletter[] = await res.json()
			return [...local, ...external.map(({ slug }) => ({ slug }))]
		}
	} catch {}

	return local
}

export const load = async ({ params, data }) => {
	if (data.external) {
		return {
			content: null,
			html: data.external.html,
			metadata: data.external.metadata,
			image: null,
			slug: data.external.slug
		}
	}

	const entry = getMarkdownEntry<Newsletter>('newsletter', params.slug)!

	return {
		content: entry.data.default,
		metadata: entry.data.metadata,
		html: null as string | null,
		image: entry.firstImage,
		slug: null
	}
}
