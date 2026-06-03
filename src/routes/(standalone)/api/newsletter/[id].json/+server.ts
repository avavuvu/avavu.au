import { getMarkdownContent, getMarkdownEntry, type MarkdownEntry, type NewsletterData } from '$lib'
import { error, json } from '@sveltejs/kit'

export const prerender = true

type Newsletter = MarkdownEntry<NewsletterData>

export const entries = () => getMarkdownContent<Newsletter>('newsletter').map(({ id }) => ({ id }))

export function GET({ params }) {
	const { id } = params

	const entry = getMarkdownEntry<Newsletter>('newsletter', id)

	if (!entry) {
		error(404, 'Not found')
	}

	return json({
		markdown: entry.rawMarkdown,
		data: entry.data.metadata
	})
}
