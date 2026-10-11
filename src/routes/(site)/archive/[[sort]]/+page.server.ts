import { error } from '@sveltejs/kit'
import { projectTypes } from '$lib/schema'
import { getWikiEntries } from '$lib/server/content'
import { getCanonicalPath } from '$lib/wikiCategory'

const sorts = ['year', 'type', 'rating'] as const
type Sort = (typeof sorts)[number]

export const entries = () => [{ sort: 'type' }, { sort: 'rating' }]

type Work = {
	href: string
	title: string
	date: string
	type: (typeof projectTypes)[number]
	rating?: 5
}

const groupers: Record<Sort, { key: (work: Work) => string; order: string[] | null }> = {
	year: { key: (work) => work.date.slice(0, 4), order: null },
	type: { key: (work) => work.type, order: [...projectTypes] },
	rating: { key: (work) => (work.rating ? '★★★★★' : 'the rest'), order: ['★★★★★', 'the rest'] }
}

export const load = ({ params }) => {
	const sort = (params.sort ?? 'year') as Sort
	if (!sorts.includes(sort) || params.sort === 'year') error(404)

	const works: Work[] = getWikiEntries('projects')
		.flatMap(({ id, metadata }) =>
			metadata.kind === 'archive' && !metadata.section
				? [
						{
							href: getCanonicalPath(id),
							title: metadata.title,
							date: metadata.date,
							type: metadata.type,
							rating: metadata.rating
						}
					]
				: []
		)
		.sort((a, b) => b.date.localeCompare(a.date))

	const { key, order } = groupers[sort]
	const grouped = Object.groupBy(works, key)
	const labels = order ?? Object.keys(grouped).sort((a, b) => b.localeCompare(a))

	return {
		sort,
		groups: labels.flatMap((label) => {
			const items = grouped[label]
			return items ? [{ label, works: items }] : []
		})
	}
}
