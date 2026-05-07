import { redirects } from './redirects.ts'
import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname

	const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

	const match = redirects.find((r) => r.from === normalized || r.from === pathname)

	if (match) {
		throw redirect(match.status, match.to)
	}

	return resolve(event)
}
