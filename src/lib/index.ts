export type { Entry, ExternalNewsletter, Image, Link } from './schema'

export type ContentEntry<M> = {
	id: string
	path: string
	metadata: M
	plainText: string
	firstImage: string | null
}

export type Member = { href: string; title: string }

export type GraphData = {
	nodeIds: string[]
	edgeList: Array<[string, string]>
	positions: Record<string, [number, number]>
	titles: Record<string, string>
	categories: Record<string, string[]>
	pageCategories: Record<string, string[]>
	sections: string[]
	paths: Record<string, string>
}

export type Backlinks = Record<string, string[]>

export type Patron = { id: string; name: string; tier: string | null }

export type Patrons = Record<string, Patron>
