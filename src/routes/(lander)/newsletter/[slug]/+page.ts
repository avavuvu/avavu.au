import type { RouteParams } from '$app/types'
import { getMarkdownContent, getMarkdownEntry, type MarkdownEntry } from '$lib'
import type { Component } from 'svelte'

export const prerender = true

type NewsletterData = {
	title: string
	date: string
	preheader: string
	crosswords?: Array<{
		info: string
		vendor: string
		link: string
		date: string
	}>
	cool?: Array<{
		title: string
		info: string
		links: string[]
	}>
	music?: Array<{
		title: string
		info: string
		link: string
	}>
}

type Newsletter = MarkdownEntry<NewsletterData>

export const entries = async () =>
	getMarkdownContent<Newsletter>('newsletter').map(({ id }) => ({
		slug: id
	})) as RouteParams<'/(lander)/newsletter/[slug]'>[]

export const load = async ({ params }) => {
	const entry = getMarkdownEntry<Newsletter>('newsletter', params.slug)

	return {
		content: entry.data.default,
		metadata: entry.data.metadata,
		image: entry.firstImage
	}
}
