import { join } from 'node:path'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'
import type { Link, Member } from '$lib'
import { externalNewsletterListSchema, externalNewsletterSchema } from '$lib/schema'
import {
	getEntries,
	getEntriesIn,
	getEntry,
	getMembers,
	getRawMarkdown,
	sectionOf
} from '$lib/server/content'
import { fetchJsonCached } from '$lib/server/externalCache'
import { yearsSince } from '$lib/utils'
import { getCanonicalPath, getCategoriesOf, isCategory, sections } from '$lib/wikiCategory'
import { buildWikiIndex, resolveBracketContent } from '../../markdoc/wikilinks'

const { index: wikiIndex } = buildWikiIndex(join(process.cwd(), 'src/content'))

const absolute = (href: string) => (href.startsWith('/') ? `${PUBLIC_SITE_URL}${href}` : href)

const readAttributes = (source: string): Record<string, string> =>
	Object.fromEntries(
		[...source.matchAll(/([\w-]+)=(?:"([^"]*)"|(\S+))/g)].map(([, key, quoted, bare]) => [
			key,
			quoted ?? bare
		])
	)

const absoluteLinks = (markdown: string) =>
	markdown
		.replace(/(!?\[[^\]]*\]\()(\/[^)\s]*)/g, (_, prefix, href) => prefix + absolute(href))
		.replace(/(\s(?:src|href)=")(\/[^"]*)/g, (_, prefix, href) => prefix + absolute(href))

const wikipediaUrl = (name: string) => `https://en.wikipedia.org/wiki/${name.replace(/ /g, '_')}`

const convertMedia = (markdown: string) =>
	markdown
		.replace(/<YouTube([^>]*?)\/>/g, (_, attributes) => {
			const { id, start } = readAttributes(attributes)
			const seconds = start?.replace(/[{}]/g, '')
			return `[YouTube video](https://www.youtube.com/watch?v=${id}${seconds ? `&t=${seconds}` : ''})`
		})
		.replace(
			/<TikTok([^>]*?)\/>/g,
			(_, attributes) =>
				`[TikTok video](https://www.tiktok.com/embed/v2/${readAttributes(attributes).id})`
		)
		.replace(
			/<Video([^>]*?)\/>/g,
			(_, attributes) => `[Video](${absolute(readAttributes(attributes).src)})`
		)

const convertLongForm = (markdown: string) => {
	const notes: string[] = []

	const body = markdown
		.replace(/<Sidenote>([\s\S]*?)<\/Sidenote>/g, (_, content) => {
			notes.push(`[^${notes.length + 1}]: ${convertMedia(content).trim()}`)
			return `[^${notes.length}]`
		})
		.replace(/<From>([\s\S]*?)<\/From>/g, (_, source) => `— ${source.trim()}`)
		.replace(/<\/?(?:Quote|Wide)>/g, '')
		.replace(/\n{3,}/g, '\n\n')

	return notes.length > 0 ? `${body.trim()}\n\n${notes.join('\n\n')}` : body
}

const convertWiki = (markdown: string) =>
	absoluteLinks(
		convertMedia(convertLongForm(markdown))
			.replaceAll('{{name}}', 'Web Surfer')
			.replace(/<WikiGraph\s*\/>/g, '')
			.replace(/<TimeSince([^>]*)\/>/g, (_, attributes) =>
				String(yearsSince(readAttributes(attributes).date))
			)
			.replace(/<Wikipedia([^>]*?)\/?>(?:<\/Wikipedia>)?/g, (_, attributes) => {
				const { title, id } = readAttributes(attributes)
				return `[Wikipedia: ${title}](${wikipediaUrl(id ?? title)})`
			})
			.replace(/<WikiImage([^>]*)>([\s\S]*?)<\/WikiImage>/g, (_, attributes, caption) => {
				const { src, alt = '' } = readAttributes(attributes)
				return `![${alt}](${absolute(src)})\n\n*${caption.trim()}*`
			})
			.replace(
				/<WikiVideo([^>]*?)(?:\/>|>([\s\S]*?)<\/WikiVideo>)/g,
				(_, attributes, caption) => {
					const { src } = readAttributes(attributes)
					return `[Video: ${caption?.trim() || 'video'}](${absolute(src)})`
				}
			)
			.replace(/\[\[(.+?)\]\]/g, (_, raw) => {
				const { href, exists, displayText } = resolveBracketContent(wikiIndex, raw)
				return exists ? `[${displayText}](${absolute(href)})` : displayText
			})
	)

const linkList = (links: Member[]) =>
	links.map(({ href, title }) => `- [${title}](${absolute(href)})`).join('\n')

const seeAlso = (links: Link[] = []) =>
	links.length > 0
		? [
				'## See also',
				links
					.map(
						({ title, url, source }) =>
							`- ${source ? `${source}: ` : ''}[${title}](${url})`
					)
					.join('\n')
			]
		: []

type Document = {
	title: string
	path: string
	date?: string
	url?: string
	categories?: Member[]
	body: string
	extra?: string[]
}

const renderDocument = ({
	title,
	path,
	date,
	url,
	categories = [],
	body,
	extra = []
}: Document) => {
	const details = [
		`URL: ${absolute(path)}`,
		date && `Date: ${date}`,
		url && `Link: ${absolute(url)}`,
		categories.length > 0 &&
			`Categories: ${categories.map(({ href, title }) => `[${title}](${absolute(href)})`).join(', ')}`
	]
		.filter(Boolean)
		.join('\n')

	return [`# ${title}`, details, body.trim(), ...extra]
		.filter((part) => part.trim().length > 0)
		.join('\n\n')
		.concat('\n')
}

type Page = {
	path: string
	title: string
	date: string
	section: string | null
	render: () => Promise<string>
}

const externalNewsletters = async () =>
	(
		await fetchJsonCached(
			'https://ava.room.lc/api/newsletters',
			'newsletters-list',
			externalNewsletterListSchema,
			[]
		)
	).filter(({ slug }) => !getEntry(slug))

const buildPages = async (): Promise<Page[]> => {
	const entries = getEntries()
	const external = await externalNewsletters()

	const titleOf = new Map(entries.map(({ id, metadata }) => [id, metadata.title]))
	const categoryLinks = (ids: string[] = []) =>
		ids.map((category) => ({
			href: getCanonicalPath(category),
			title: titleOf.get(category) ?? category
		}))

	const newsletterLinks = [
		...getEntriesIn('newsletter').map(({ id, metadata }) => ({
			href: getCanonicalPath(id),
			title: metadata.title,
			date: metadata.date ?? ''
		})),
		...external.map(({ slug, title, date }) => ({ href: `/newsletter/${slug}`, title, date }))
	]
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(({ href, title }) => ({ href, title }))

	const membersOf = (id: string) => {
		if (id === 'newsletter') return newsletterLinks
		return isCategory(id) ? getMembers(id) : []
	}

	const entryPages: Page[] = entries.map(({ id, path, metadata }) => {
		const canonical = getCanonicalPath(id)
		const intro = [
			metadata.preheader && `*${metadata.preheader}*`,
			metadata.layout === 'longform' && metadata.description
		].filter(Boolean)

		return {
			path: canonical,
			title: metadata.title,
			date: metadata.date ?? '',
			section: metadata.section ? id : (sectionOf(id) ?? null),
			render: async () => {
				const members = membersOf(id)
				return renderDocument({
					title: metadata.title,
					path: canonical,
					date: metadata.section ? undefined : metadata.date,
					url: metadata.url,
					categories: categoryLinks(getCategoriesOf(id)),
					body: [...intro, convertWiki(getRawMarkdown(path))].join('\n\n'),
					extra: [
						...(members.length > 0
							? [`## Pages tagged as ${metadata.title}`, linkList(members)]
							: []),
						...seeAlso(metadata.links)
					]
				})
			}
		}
	})

	const externalPages: Page[] = external.map(({ slug, title, date }) => {
		const path = `/newsletter/${slug}`
		return {
			path,
			title,
			date,
			section: 'newsletter',
			render: async () => {
				const data = await fetchJsonCached(
					`https://ava.room.lc/api/newsletters/${slug}`,
					`newsletter-${slug}`,
					externalNewsletterSchema,
					null
				)
				return renderDocument({
					title,
					path,
					date,
					categories: categoryLinks(['newsletter']),
					body: data ? `*${data.subtitle}*\n\n${data.content}` : ''
				})
			}
		}
	})

	return [...entryPages, ...externalPages].sort(
		(a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
	)
}

let pagesPromise: Promise<Page[]> | null = null
const getPages = () => (pagesPromise ??= buildPages())

export const getAgentMarkdownPaths = async () => (await getPages()).map(({ path }) => path)

export const getAgentMarkdown = async (path: string) => {
	const page = (await getPages()).find((candidate) => candidate.path === path)
	return page ? page.render() : null
}

export const agentMarkdownSegments = async (depth: 1 | 2, include: (first: string) => boolean) =>
	(await getAgentMarkdownPaths())
		.map((path) => path.split('/').slice(1))
		.filter((segments) => segments.length === depth && include(segments[0]))

export const serveAgentMarkdown = async (path: string) => {
	const markdown = await getAgentMarkdown(path)
	if (!markdown) error(404)
	return new Response(markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } })
}

export const getLlmsTxt = async () => {
	const pages = await getPages()
	const link = ({ path, title }: Page) => `- [${title}](${absolute(path)}.md)`

	const sectionBlocks = sections.map((section) => {
		const sectionPage = pages.find(({ path }) => path === getCanonicalPath(section))
		const members = pages.filter((page) => page.section === section && page !== sectionPage)
		return [
			`## ${sectionPage?.title ?? section}`,
			[sectionPage, ...members]
				.filter((page) => page !== undefined)
				.map(link)
				.join('\n')
		].join('\n\n')
	})

	const other = pages.filter(({ section }) => section === null)

	return [
		'# Ava Dinh-Vu',
		"> Ava Dinh-Vu's portfolio and personal wiki: web design, games, music, writing and a monthly newsletter.",
		`Every page on ${PUBLIC_SITE_URL} is also available as markdown. Add \`.md\` to the URL of the page.`,
		...sectionBlocks,
		['## Other pages', other.map(link).join('\n')].join('\n\n')
	]
		.join('\n\n')
		.concat('\n')
}
