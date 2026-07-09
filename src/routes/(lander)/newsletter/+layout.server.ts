export const prerender = true

export type ExternalNewsletter = {
	slug: string
	title: string
	subtitle: string
	date: string
}

export const load = async ({ fetch }) => {
	try {
		const res = await fetch('https://ava.room.lc/api/newsletters')
		if (res.ok) {
			const external: ExternalNewsletter[] = await res.json()
			return { externalNewsletters: external }
		}
	} catch {}

	return { externalNewsletters: [] as ExternalNewsletter[] }
}
