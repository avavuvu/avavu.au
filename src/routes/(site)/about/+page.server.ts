import { getEntry, getMembers } from '$lib/server/content'
import { getCategoryNodeIds } from '$lib/wikiCategory'

export const load = () => ({
	entry: getEntry('about')!,
	members: getMembers('about'),
	current: 'about',
	highlighted: getCategoryNodeIds('about'),
	canonical: '/about'
})
