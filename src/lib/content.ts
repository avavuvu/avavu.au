import type { Component } from 'svelte'

const components = import.meta.glob<Component>(['/src/content/**/*.md', '/src/wiki/**/*.md'], {
	import: 'default'
})

export const loadComponent = (path: string) => components[path]()

export const withComponent = async <T extends { entry: { path: string } }>(data: T) => ({
	...data,
	component: await loadComponent(data.entry.path)
})
