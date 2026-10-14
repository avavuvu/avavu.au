import { error } from '@sveltejs/kit'
import { getEntriesIn, getEntry, getRawMarkdown } from '$lib/server/content'

export const prerender = true

export const entries = () => getEntriesIn('newsletter').map(({ id }) => ({ id }))

export function GET({ params }) {
	const entry = getEntry(params.id)
	if (!entry || !getEntriesIn('newsletter').includes(entry)) error(404, 'Newsletter not found')

	const { title, subject, date, preheader } = entry.metadata

	return new Response(
		JSON.stringify({
			markdown: getRawMarkdown(entry.path),
			data: { title, subject, date, preheader }
		}),
		{ status: 200 }
	)
}
