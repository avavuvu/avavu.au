import { error } from '@sveltejs/kit'
import { essaySlug, getMarkdocContent } from '$lib/server/markdoc'
import { getCategoryNodeIds } from '$lib/wikiCategory'

export const entries = () => getMarkdocContent().map(({ id }) => ({ id: essaySlug(id) }))

export const load = ({ params }) => {
	const match = getMarkdocContent().find(({ id }) => essaySlug(id) === params.id)
	if (!match) error(404)

	return {
		html: match.data.html,
		metadata: match.data.metadata,
		current: params.id,
		highlighted: getCategoryNodeIds('essays'),
		canonical: `/essays/${params.id}`,
		wide: true
	}
}
