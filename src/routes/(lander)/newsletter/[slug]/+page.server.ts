import { error } from '@sveltejs/kit'
import { getMarkdownContent, type MarkdownEntry, type NewsletterData } from '$lib'
import { marked } from 'marked'

type Newsletter = MarkdownEntry<NewsletterData>

export const load = async ({ params, fetch }) => {
	const isLocal = getMarkdownContent<Newsletter>('newsletter').some(
		({ id }) => id === params.slug
	)

	if (isLocal) return { external: null }

	const res = await fetch(`https://ava.room.lc/api/newsletters/${params.slug}`)

	if (!res.ok) error(404, 'Not found')

	const data = await res.json()

	return {
		external: {
			html: await marked.parse(data.content ?? ''),
			metadata: {
				title: data.title as string,
				date: data.date as string,
				preheader: data.subtitle as string
			},
			slug: data.slug as string
		}
	}
}
