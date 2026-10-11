import { patreonMembersSchema } from '../../src/lib/schema.ts'

const CAMPAIGN_ID = '2722716'
const AVA_PATREON_USER_ID = '19662370'
const USER_AGENT = 'avavu.au'

export type PaidPatron = { name: string; tier: string | null }

export const fetchPaidPatrons = async (): Promise<PaidPatron[] | null> => {
	const token = process.env.PATREON_CREATOR_TOKEN
	if (!token) return null

	const patrons: PaidPatron[] = []
	let cursor: string | null = null

	do {
		const params = new URLSearchParams({
			include: 'user,currently_entitled_tiers',
			'fields[member]': 'full_name,patron_status,currently_entitled_amount_cents',
			'fields[tier]': 'title,amount_cents',
			'page[size]': '100'
		})
		if (cursor) params.set('page[cursor]', cursor)

		const response = await fetch(
			`https://www.patreon.com/api/oauth2/v2/campaigns/${CAMPAIGN_ID}/members?${params}`,
			{ headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT } }
		)

		if (!response.ok) {
			throw new Error(
				`Patreon members request failed: ${response.status} ${await response.text()}`
			)
		}

		const parsed = patreonMembersSchema.safeParse(await response.json())
		if (!parsed.success) {
			throw new Error(`Patreon members response is not valid: ${parsed.error.message}`)
		}

		const { data, included = [], meta } = parsed.data
		const tiers = new Map(
			included
				.filter(({ type }) => type === 'tier')
				.map(({ id, attributes }) => [id, attributes ?? {}])
		)

		for (const { attributes, relationships } of data) {
			if (attributes.patron_status !== 'active_patron') continue
			if (attributes.currently_entitled_amount_cents <= 0) continue
			if (relationships?.user?.data?.id === AVA_PATREON_USER_ID) continue

			const tier = (relationships?.currently_entitled_tiers?.data ?? [])
				.map(({ id }) => tiers.get(id))
				.filter((tier) => tier?.title)
				.sort((a, b) => (b?.amount_cents ?? 0) - (a?.amount_cents ?? 0))[0]

			patrons.push({ name: attributes.full_name.trim(), tier: tier?.title ?? null })
		}

		cursor = meta.pagination.cursors?.next ?? null
	} while (cursor)

	return patrons.sort((a, b) => a.name.localeCompare(b.name))
}
