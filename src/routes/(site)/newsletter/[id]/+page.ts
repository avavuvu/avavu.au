import { loadComponent } from '$lib/content'

export const load = async ({ data }) => ({
	...data,
	component: data.path ? await loadComponent(data.path) : null
})
