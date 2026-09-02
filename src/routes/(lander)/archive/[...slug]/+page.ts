// +page.ts
import { error } from '@sveltejs/kit'
import {
	getMarkdownContent,
	getMarkdownEntry,
	type MarkdownEntry,
	type Frontmatter,
	type ArchiveFrontmatter
} from '$lib'
import type { RouteParams } from '$app/types'

export const prerender = true

const sortTypes = ['year', 'rating', 'type'] as const
type SortKey = (typeof sortTypes)[number]

type ArchiveEntry = MarkdownEntry<Frontmatter & ArchiveFrontmatter>

const sortMap: Record<SortKey, (entry: ArchiveEntry) => string> = {
	year: (entry) => String(new Date(entry.metadata.date).getFullYear()),
	rating: (entry) => (entry.metadata.rating ? '5' : 'other'),
	type: (entry) => entry.metadata.type
}

export const entries = () => {
	const allWorks = getMarkdownContent<ArchiveEntry>('projects')

	const paths: RouteParams<'/(lander)/archive/[...slug]'>[] = []

	paths.push({ slug: '' })

	// /archive/year, /archive/rating, /archive/type
	for (const sort of sortTypes) {
		paths.push({ slug: sort })

		// /archive/year/2024, /archive/type/music, etc.
		const groups = Object.groupBy(allWorks, (entry) => sortMap[sort](entry.data))
		for (const subcategory of Object.keys(groups)) {
			paths.push({ slug: `${sort}/${subcategory}` })

			// /archive/year/2024/my-slug
			for (const entry of groups[subcategory] ?? []) {
				paths.push({ slug: `${sort}/${subcategory}/${entry.id}` })
			}
		}
	}

	return paths
}

export const load = async ({ params }) => {
	const [sort, subcategory, slug] = params.slug.split('/')
	const allWorks = getMarkdownContent<ArchiveEntry>('projects')

	if (!sortTypes.includes(sort as SortKey)) error(404)

	const groupedWorks = Object.groupBy(allWorks, (entry) => sortMap[sort as SortKey](entry.data))

	const base = { sort, groupedWorks, allWorks }

	if (!subcategory) {
		return { view: 'index' as const, ...base }
	}

	const works = groupedWorks[subcategory]
	if (!works) error(404)

	const group = { ...base, subcategory, works }

	if (!slug) {
		return { view: 'group' as const, ...group }
	}

	const entry = getMarkdownEntry<ArchiveEntry>('projects', slug)
	if (!entry) error(404)

	return { view: 'entry' as const, ...group, entry }
}
