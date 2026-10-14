import { getEntries } from '$lib/server/content'
import { getCanonicalPath } from '$lib/wikiCategory'

export const load = () => ({
	paths: getEntries().map(({ id }) => getCanonicalPath(id))
})
