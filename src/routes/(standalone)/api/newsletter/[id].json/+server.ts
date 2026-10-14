import { error } from '@sveltejs/kit'
import { aliasSlugsOf, getEntriesIn, getEntryByAlias, getRawMarkdown } from '$lib/server/content'

export const prerender = true

export const entries = () => {
	const newsletters = getEntriesIn('newsletter')
	return [...newsletters.map(({ id }) => id), ...aliasSlugsOf(newsletters)].map((id) => ({ id }))
}

export function GET({ params }) {
	const newsletters = getEntriesIn('newsletter')
	const entry =
		newsletters.find(({ id }) => id === params.id) ?? getEntryByAlias(params.id, newsletters)
	if (!entry) error(404, 'Newsletter not found')

	const { title, subject, date, preheader } = entry.metadata

	return new Response(
		JSON.stringify({
			markdown: getRawMarkdown(entry.path),
			data: { title, subject, date, preheader }
		}),
		{ status: 200 }
	)
}
