import { error } from '@sveltejs/kit'
import { getNewsletter, getNewsletters, getRawMarkdown } from '$lib/server/content'

export const prerender = true

export const entries = () => getNewsletters().map(({ id }) => ({ id }))

export function GET({ params }) {
	const entry = getNewsletter(params.id)

	if (!entry) {
		error(404, 'Newsletter not found')
	}

	return new Response(
		JSON.stringify({
			markdown: getRawMarkdown(entry.path),
			data: entry.metadata
		}),
		{ status: 200 }
	)
}
