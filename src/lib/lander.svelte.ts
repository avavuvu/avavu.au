import { page } from '$app/state'

class GlobalState {
	header = $state('')

	depth = $derived(
		page.url.pathname === '/' ? 1 : page.url.pathname.split('/').filter(Boolean).length + 1
	)

	setHeader = (header: string) => {
		this.header = header.toUpperCase()
	}
}

export const globalState = new GlobalState()
