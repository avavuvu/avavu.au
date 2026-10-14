import { z } from 'zod'

const isoDate = z.coerce.date().transform((date) => date.toISOString().slice(0, 10))

export const collaboratorSchema = z.strictObject({
	name: z.string(),
	url: z.url().optional()
})

export const musicLinksSchema = z.strictObject({
	bandcamp: z.url(),
	apple: z.url(),
	spotify: z.url()
})

export const linkSchema = z.strictObject({
	title: z.string().min(1),
	url: z.url(),
	source: z.string().optional()
})

export const imageSchema = z.strictObject({
	src: z.string().min(1),
	alt: z.string()
})

export type Link = z.output<typeof linkSchema>
export type Image = z.output<typeof imageSchema>

export const projectTypes = [
	'misc',
	'interactive',
	'ephemera',
	'music',
	'video',
	'writing'
] as const

const projectOnlyFields = ['rating', 'collaborators', 'music'] as const

export const entrySchema = z
	.strictObject({
		title: z.string().min(1),
		date: isoDate.optional(),
		description: z.string().optional(),
		image: imageSchema.optional(),
		url: z.string().optional(),
		links: z.array(linkSchema).optional(),
		aliases: z.array(z.string()).optional(),
		categories: z.array(z.string().min(1)).optional(),
		section: z.literal(true).optional(),
		layout: z.enum(['minimal', 'longform']).optional(),
		preheader: z.string().optional(),
		subject: z.string().optional(),
		type: z.enum(projectTypes).optional(),
		rating: z.literal(5).optional(),
		collaborators: z.array(collaboratorSchema).optional(),
		music: musicLinksSchema.optional()
	})
	.superRefine((entry, context) => {
		if (entry.type && !entry.date) {
			context.addIssue({
				code: 'custom',
				path: ['date'],
				message: 'projects (with a type) need a date'
			})
		}
		if (entry.layout === 'longform' && !entry.date) {
			context.addIssue({
				code: 'custom',
				path: ['date'],
				message: 'longform pages need a date'
			})
		}
		for (const field of projectOnlyFields) {
			if (!entry.type && entry[field] !== undefined) {
				context.addIssue({
					code: 'custom',
					path: [field],
					message: `"${field}" needs a type`
				})
			}
		}
	})

export type Entry = z.output<typeof entrySchema>

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
