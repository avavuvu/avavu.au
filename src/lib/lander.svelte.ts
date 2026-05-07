import { page } from '$app/state'

class GlobalState {
	depth = $derived(
		page.url.pathname === '/' ? 1 : page.url.pathname.split('/').filter(Boolean).length + 1
	)
}

export const globalState = new GlobalState()
