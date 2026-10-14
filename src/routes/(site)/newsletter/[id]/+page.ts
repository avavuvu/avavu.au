import { loadComponent } from '$lib/content'

export const load = async ({ data }) => ({
	...data,
	component: data.entry ? await loadComponent(data.entry.path) : null
})
