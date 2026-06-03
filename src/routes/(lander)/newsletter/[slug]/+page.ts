import type { RouteParams } from '$app/types'
import { getMarkdownContent, getMarkdownEntry, type MarkdownEntry, type NewsletterData } from '$lib'

export const prerender = true

type Newsletter = MarkdownEntry<NewsletterData>

export const entries = async () =>
	getMarkdownContent<Newsletter>('newsletter').map(({ id }) => ({
		slug: id
	})) as RouteParams<'/(lander)/newsletter/[slug]'>[]

export const load = async ({ params }) => {
	const entry = getMarkdownEntry<Newsletter>('newsletter', params.slug)

	return {
		content: entry.data.default,
		metadata: entry.data.metadata,
		image: entry.firstImage
	}
}
