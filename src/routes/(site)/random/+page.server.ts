import { getWikiEntries } from '$lib/server/content'
import { getCanonicalPath } from '$lib/wikiCategory'

export const load = () => ({
	paths: getWikiEntries().map(({ id }) => getCanonicalPath(id))
})
