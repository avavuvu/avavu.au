import { join } from 'node:path'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'
import type { Member } from '$lib'
import { essaySchema, externalNewsletterListSchema, externalNewsletterSchema } from '$lib/schema'
import { getMembers, getNewsletters, getRawMarkdown, getWikiEntries } from '$lib/server/content'
import { fetchJsonCached } from '$lib/server/externalCache'
import { essaySlug } from '$lib/server/markdoc'
import { yearsSince } from '$lib/utils'
import { getCanonicalPath, isCategory, sections } from '$lib/wikiCategory'
import { buildWikiIndex, readFrontmatter, resolveBracketContent } from '../../markdoc/wikilinks'

const { index: wikiIndex } = buildWikiIndex(join(process.cwd(), 'src/wiki'))

const essaySources = import.meta.glob<string>('/src/content/writing/*.mdoc', {
	eager: true,
	query: '?raw',
	import: 'default'
})

const absolute = (href: string) => (href.startsWith('/') ? `${PUBLIC_SITE_URL}${href}` : href)

const readAttributes = (source: string): Record<string, string> =>
	Object.fromEntries(
		[...source.matchAll(/([\w-]+)=(?:"([^"]*)"|(\S+))/g)].map(([, key, quoted, bare]) => [
			key,
			quoted ?? bare
		])
	)

const stripFrontmatter = (source: string) => source.replace(/^---\n[\s\S]*?\n---\n?/, '')

const absoluteLinks = (markdown: string) =>
	markdown.replace(/(!?\[[^\]]*\]\()(\/[^)\s]*)/g, (_, prefix, href) => prefix + absolute(href))

const wikipediaUrl = (name: string) => `https://en.wikipedia.org/wiki/${name.replace(/ /g, '_')}`

const convertWiki = (markdown: string) =>
	absoluteLinks(
		markdown
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

const convertEssayTags = (markdoc: string) =>
	markdoc
		.replace(/\{%\s*youtube\s+([^%]*?)\/%\}/g, (_, attributes) => {
			const { watch, start } = readAttributes(attributes)
			return `[YouTube video](https://www.youtube.com/watch?v=${watch}${start ? `&t=${start}` : ''})`
		})
		.replace(/\{%\s*tiktok\s+([^%]*?)\/%\}/g, (_, attributes) => {
			return `[TikTok video](https://www.tiktok.com/embed/v2/${readAttributes(attributes).videoid})`
		})
		.replace(/\{%\s*video\s+([^%]*?)\/%\}/g, (_, attributes) => {
			return `[Video](${absolute(readAttributes(attributes).src)})`
		})
		.replace(/\{%\s*street-view\s+([^%]*?)\/%\}/g, (_, attributes) => {
			return `![Street view](${absolute(`/images/writing/tram/${readAttributes(attributes).name}.jpg`)})`
		})
		.replace(
			/\{%\s*from\s*%\}([\s\S]*?)\{%\s*\/from\s*%\}/g,
			(_, source) => `— ${source.trim()}`
		)
		.replace(/\{%[^%]*%\}/g, '')

const convertEssay = (markdoc: string) => {
	const notes: string[] = []

	const body = stripFrontmatter(markdoc)
		.replace(
			/\{%\s*note-content\s+i="([^"]+)"\s*%\}([\s\S]*?)\{%\s*\/note-content\s*%\}/g,
			(_, id, content) => {
				const text = convertEssayTags(content).trim().replace(/\n/g, '\n    ')
				notes.push(`[^${id}]: ${text}`)
				return ''
			}
		)
		.replace(/\{%\s*note\s+i="([^"]+)"\s*\/%\}/g, '[^$1]')

	const converted = absoluteLinks(convertEssayTags(body))
		.replace(/\n{3,}/g, '\n\n')
		.trim()

	return notes.length > 0 ? `${converted}\n\n${absoluteLinks(notes.join('\n\n'))}` : converted
}

const linkList = (links: Member[]) =>
	links.map(({ href, title }) => `- [${title}](${absolute(href)})`).join('\n')

type Document = {
	title: string
	path: string
	date?: string
	categories?: Member[]
	body: string
	extra?: string[]
}

const renderDocument = ({ title, path, date, categories = [], body, extra = [] }: Document) => {
	const details = [
		`URL: ${absolute(path)}`,
		date && `Date: ${date}`,
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

type Page = { path: string; title: string; section: string | null; render: () => Promise<string> }

const essays = () =>
	Object.entries(essaySources)
		.map(([file, source]) => {
			const id = file.split('/').at(-1)!.replace('.mdoc', '')
			const metadata = essaySchema.parse(readFrontmatter(source) ?? {})
			return { path: `/essays/${essaySlug(id)}`, metadata, source }
		})
		.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date))

const newsletterSummaries = async () => {
	const local = getNewsletters().map(({ id, path, metadata }) => ({
		slug: id,
		title: metadata.title,
		date: metadata.date,
		local: { path, metadata }
	}))

	const external = (
		await fetchJsonCached(
			'https://ava.room.lc/api/newsletters',
			'newsletters-list',
			externalNewsletterListSchema,
			[]
		)
	).map(({ slug, title, date }) => ({ slug, title, date, local: null }))

	return [...local, ...external].sort((a, b) => b.date.localeCompare(a.date))
}

const buildPages = async (): Promise<Page[]> => {
	const essayList = essays()
	const newsletters = await newsletterSummaries()

	const essayLinks = essayList.map(({ path, metadata }) => ({
		href: path,
		title: metadata.title
	}))
	const newsletterLinks = newsletters.map(({ slug, title }) => ({
		href: `/newsletter/${slug}`,
		title
	}))

	const entries = getWikiEntries()
	const titleOf = new Map(entries.map(({ id, metadata }) => [id, metadata.title]))
	const essayPaths = new Set(essayList.map(({ path }) => path))

	const membersOf = (id: string) => {
		if (id === 'essays') return essayLinks
		if (id === 'newsletter') return newsletterLinks
		return isCategory(id) ? getMembers(id) : []
	}

	const wikiPages: Page[] = entries
		.filter(({ id }) => !essayPaths.has(getCanonicalPath(id)))
		.map(({ id, path, metadata }) => {
			const canonical = getCanonicalPath(id)
			return {
				path: canonical,
				title: metadata.title,
				section: metadata.section
					? id
					: ((metadata.categories ?? []).find((category) =>
							sections.includes(category)
						) ?? null),
				render: async () => {
					const members = membersOf(id)
					return renderDocument({
						title: metadata.title,
						path: canonical,
						date:
							metadata.kind === 'archive' && !metadata.section
								? metadata.date
								: undefined,
						categories: (metadata.categories ?? []).map((category) => ({
							href: getCanonicalPath(category),
							title: titleOf.get(category) ?? category
						})),
						body: convertWiki(getRawMarkdown(path)),
						extra:
							members.length > 0
								? [`## Pages tagged as ${metadata.title}`, linkList(members)]
								: []
					})
				}
			}
		})

	const essayPages: Page[] = essayList.map(({ path, metadata, source }) => ({
		path,
		title: metadata.title,
		section: 'essays',
		render: async () =>
			renderDocument({
				title: metadata.title,
				path,
				date: metadata.date,
				body: `${metadata.description}\n\n${convertEssay(source)}`,
				extra: metadata.links
					? [
							'## See also',
							metadata.links
								.map(({ title, pub, url }) => `- ${pub}: [${title}](${url})`)
								.join('\n')
						]
					: []
			})
	}))

	const newsletterPages: Page[] = newsletters.map(({ slug, title, date, local }) => {
		const path = `/newsletter/${slug}`

		return {
			path,
			title,
			section: 'newsletter',
			render: async () => {
				if (local) {
					return renderDocument({
						title,
						path,
						date,
						body: `*${local.metadata.preheader}*\n\n${convertWiki(getRawMarkdown(local.path))}`
					})
				}

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
					body: data ? `*${data.subtitle}*\n\n${data.content}` : ''
				})
			}
		}
	})

	return [...wikiPages, ...essayPages, ...newsletterPages]
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
