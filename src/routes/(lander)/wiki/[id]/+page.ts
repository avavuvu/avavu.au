import { error, redirect } from '@sveltejs/kit'
import { getMarkdownContent, type MarkdownEntry, type MarkdownFrontmatter } from '$lib'
import type { RouteParams } from '$app/types'
import slugify from 'slugify'

export const prerender = true

const sectionKeys = ['projects', 'bio', 'people', 'glossary'] as const

type WikiEntry = MarkdownEntry<MarkdownFrontmatter>

const toSlug = (value: string) => slugify(value, { lower: true, strict: true })

const allWorks = () => sectionKeys.flatMap((section) => getMarkdownContent<WikiEntry>(section))

export const entries = () => {
	const paths: RouteParams<'/(lander)/wiki/[id]'>[] = []

	for (const work of allWorks()) {
		paths.push({ id: work.id })

		for (const alias of work.data.metadata.aliases ?? []) {
			paths.push({ id: toSlug(alias) })
		}
	}

	return paths
}

export const load = async ({ params }) => {
	const works = allWorks()

	const entry = works.find((work) => work.id === params.id)
	if (entry) {
		return { entry }
	}

	const redirectTarget = works.find((work) =>
		(work.data.metadata.aliases ?? []).some((alias) => toSlug(alias) === params.id)
	)
	if (redirectTarget) redirect(308, `/wiki/${redirectTarget.id}`)

	error(404)
}
