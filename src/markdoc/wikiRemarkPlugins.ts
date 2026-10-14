import wikiLinkPlugin from 'remark-wiki-link/lib/index.js'
import type { Node } from 'unist'
import type { Root, Html, Heading, PhrasingContent } from 'mdast'
import slugify from 'slugify'
import {
	isExternalWikiLink,
	splitHash,
	resolveWikiHref,
	resolveWikiPageName,
	resolveBracketContent,
	defaultWikiDisplayText
} from './wikilinks.ts'

type WikiLinkNode = Node & {
	type: 'wikiLink'
	value: string
	data?: {
		alias?: string
		hProperties?: Record<string, unknown>
		hChildren?: Array<{ type: string; value: string }>
	}
}

const createHtmlWikiLinkPlugin = (wikiIndex: Map<string, string>) => () => async (tree: Root) => {
	const { visit } = await import('unist-util-visit')

	visit(tree, 'html', (node: Html) => {
		node.value = node.value.replace(/\[\[(.+?)\]\]/g, (_match, raw) => {
			const { href, exists, displayText } = resolveBracketContent(wikiIndex, raw)
			const className = isExternalWikiLink(raw)
				? 'external'
				: exists
					? 'internal'
					: 'internal new'
			return `<a class="${className}" href="${href}">${displayText}</a>`
		})
	})
}

const textOf = (nodes: PhrasingContent[]): string =>
	nodes
		.map((node) =>
			'value' in node ? node.value : 'children' in node ? textOf(node.children) : ''
		)
		.join('')

const createHeadingIdPlugin = () => () => async (tree: Root) => {
	const { visit } = await import('unist-util-visit')
	const used = new Map<string, number>()

	visit(tree, 'heading', (node: Heading) => {
		const base = slugify(textOf(node.children), { lower: true, strict: true })
		if (!base) return
		const count = used.get(base) ?? 0
		used.set(base, count + 1)
		const data = (node.data ??= {}) as { hProperties?: Record<string, unknown> }
		data.hProperties = { ...data.hProperties, id: count ? `${base}-${count + 1}` : base }
	})
}

const createWikiLinkDisplayPlugin =
	(wikiIndex: Map<string, string>) => () => async (tree: Root) => {
		const { visit } = await import('unist-util-visit')

		visit(tree, 'wikiLink', (node: WikiLinkNode) => {
			if (!node.data) return

			if (isExternalWikiLink(node.value)) {
				node.data.hProperties = { ...node.data.hProperties, className: 'external' }
			} else {
				const [page, hash] = splitHash(resolveWikiPageName(node.value))
				if (hash && wikiIndex.has(page)) {
					node.data.hProperties = { ...node.data.hProperties, className: 'internal' }
				}
			}

			if (node.data.alias !== node.value) return

			const displayText = defaultWikiDisplayText(node.value)
			node.data.alias = displayText
			node.data.hChildren = [{ type: 'text', value: displayText }]
		})
	}

export const createWikiRemarkPlugins = (wikiIndex: Map<string, string>) => [
	[
		wikiLinkPlugin,
		{
			aliasDivider: '|',
			permalinks: [...wikiIndex.keys()],
			pageResolver: (name: string) => [resolveWikiPageName(name)],
			hrefTemplate: (permalink: string) => resolveWikiHref(wikiIndex, permalink)
		}
	],
	createWikiLinkDisplayPlugin(wikiIndex),
	createHtmlWikiLinkPlugin(wikiIndex),
	createHeadingIdPlugin()
]
