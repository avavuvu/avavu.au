import { getMembers, getWikiEntry } from '$lib/server/content'
import { getCategoryNodeIds } from '$lib/wikiCategory'

export const load = () => ({
	entry: getWikiEntry('about')!,
	members: getMembers('about'),
	current: 'about',
	highlighted: getCategoryNodeIds('about'),
	canonical: '/about'
})
