import type { RouteParams } from '$app/types'

import { getMarkdocContent } from '$lib/markdoc.js'

export const prerender = true

export const entries = async () =>
	getMarkdocContent().map(({ id }) => ({
		slug: id
	})) as RouteParams<'/(standalone)/writing/[slug]'>[]

export const load = async ({ params }) => {
	const content = getMarkdocContent()

	const match = content.find(({ id }) => id === params.slug)!

	return {
		html: match.data.html,
		metadata: match.data.metadata
	}
}
