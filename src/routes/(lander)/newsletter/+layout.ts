import type { RouteParams } from '$app/types'
import { getMarkdownContent, type CategoryKey } from '$lib'
import type { Component } from 'svelte'

export const prerender = true

export const load = async ({ params }) => {
	const newsletters = getMarkdownContent("newsletter")

	return {
		newsletters,
	}
}
