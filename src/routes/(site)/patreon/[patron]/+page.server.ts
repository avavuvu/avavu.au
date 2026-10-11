import { error } from '@sveltejs/kit'
import type { Patrons } from '$lib'
import rawPatrons from '$lib/server/patrons.json'
import { getCanonicalPath, getCategoryNodeIds } from '$lib/wikiCategory'

const patrons = rawPatrons as Patrons

export const entries = () => Object.keys(patrons).map((patron) => ({ patron }))

export const load = ({ params }) => {
	const patron = patrons[params.patron]
	if (!patron) error(404)

	return {
		patron,
		patreonPath: getCanonicalPath('patreon'),
		current: patron.id,
		highlighted: getCategoryNodeIds('patreon'),
		canonical: `/patreon/${params.patron}`
	}
}
