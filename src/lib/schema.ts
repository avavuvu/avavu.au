import { z } from 'zod'

const isoDate = z.coerce.date().transform((date) => date.toISOString().slice(0, 10))

const pageId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be a page id, like "live-coding"')

export const collaboratorSchema = z.strictObject({
	name: z.string(),
	url: z.url().optional()
})

export const musicLinksSchema = z.strictObject({
	bandcamp: z.url(),
	apple: z.url(),
	spotify: z.url()
})

const wikiFields = {
	title: z.string().min(1),
	aliases: z.array(z.string()).optional(),
	categories: z.array(pageId).optional(),
	section: z.literal(true).optional(),
	layout: z.literal('minimal').optional()
}

export const projectTypes = [
	'misc',
	'interactive',
	'ephemera',
	'music',
	'video',
	'writing'
] as const

export const wikiPageSchema = z
	.strictObject(wikiFields)
	.transform((page) => ({ ...page, kind: 'wiki' as const }))

export const projectSchema = z
	.strictObject({
		...wikiFields,
		date: isoDate,
		type: z.enum(projectTypes),
		rating: z.literal(5).optional(),
		link: z.string().optional(),
		youtubeId: z.string().optional(),
		collaborators: z.array(collaboratorSchema).optional(),
		music: musicLinksSchema.optional()
	})
	.transform((page) => ({ ...page, kind: 'archive' as const }))

export const wikiFolderSchemas = {
	projects: projectSchema,
	bio: wikiPageSchema,
	people: wikiPageSchema,
	glossary: wikiPageSchema
} as const

export type WikiFolder = keyof typeof wikiFolderSchemas
export const wikiFolders = Object.keys(wikiFolderSchemas) as WikiFolder[]

export type WikiPage = z.output<typeof wikiPageSchema>
export type Project = z.output<typeof projectSchema>
export type WikiMeta = WikiPage | Project

export const newsletterSchema = z.strictObject({
	title: z.string().min(1),
	subject: z.string().optional(),
	date: isoDate,
	preheader: z.string()
})

export type Newsletter = z.output<typeof newsletterSchema>

export const essaySchema = z.strictObject({
	title: z.string().min(1),
	date: isoDate,
	description: z.string(),
	heroImageSrc: z.string(),
	heroImageAlt: z.string(),
	color: z.string(),
	tags: z
		.array(z.string())
		.nullish()
		.transform((tags) => tags ?? []),
	links: z.array(z.strictObject({ title: z.string(), pub: z.string(), url: z.url() })).optional(),
	bsky: z.strictObject({ did: z.string(), postCid: z.string() }).optional()
})

export type Essay = z.output<typeof essaySchema>

export const externalNewsletterSummarySchema = z.object({
	slug: z.string().min(1),
	title: z.string().min(1),
	subtitle: z.string(),
	date: isoDate
})

export const externalNewsletterListSchema = z.array(externalNewsletterSummarySchema)

export const externalNewsletterSchema = externalNewsletterSummarySchema.extend({
	content: z.string()
})

export type ExternalNewsletter = z.output<typeof externalNewsletterSchema>

const relationshipList = z.object({ data: z.array(z.object({ id: z.string() })) })

export const patreonMembersSchema = z.object({
	data: z.array(
		z.object({
			attributes: z.object({
				full_name: z.string(),
				patron_status: z.string().nullable(),
				currently_entitled_amount_cents: z.number()
			}),
			relationships: z
				.object({
					user: z.object({ data: z.object({ id: z.string() }).nullable() }).optional(),
					currently_entitled_tiers: relationshipList.optional()
				})
				.optional()
		})
	),
	included: z
		.array(
			z.object({
				id: z.string(),
				type: z.string(),
				attributes: z
					.object({ title: z.string().nullish(), amount_cents: z.number().nullish() })
					.optional()
			})
		)
		.optional(),
	meta: z.object({
		pagination: z.object({
			cursors: z.object({ next: z.string().nullable() }).nullish()
		})
	})
})
