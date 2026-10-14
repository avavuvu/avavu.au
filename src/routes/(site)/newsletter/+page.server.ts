import { externalNewsletterListSchema } from '$lib/schema'
import { getEntriesIn, getEntry } from '$lib/server/content'
import { fetchJsonCached } from '$lib/server/externalCache'
import { getCategoryNodeIds } from '$lib/wikiCategory'

export const load = async () => {
	const local = getEntriesIn('newsletter').map(({ id, metadata }) => ({
		href: `/newsletter/${id}`,
		title: metadata.title,
		date: metadata.date ?? ''
	}))

	const external = (
		await fetchJsonCached(
			'https://ava.room.lc/api/newsletters',
			'newsletters-list',
			externalNewsletterListSchema,
			[]
		)
	).map(({ slug, title, date }) => ({ href: `/newsletter/${slug}`, title, date }))

	return {
		entry: getEntry('newsletter')!,
		members: [...local, ...external]
			.sort((a, b) => b.date.localeCompare(a.date))
			.map(({ href, title }) => ({ href, title })),
		current: 'newsletter',
		highlighted: getCategoryNodeIds('newsletter')
	}
}
