import wikiLinkPlugin from 'remark-wiki-link/lib/index.js'
import type { Node } from 'unist'
import type { Root, Html } from 'mdast'
import {
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
		hChildren?: Array<{ type: string; value: string }>
	}
}

const createHtmlWikiLinkPlugin = (wikiIndex: Map<string, string>) => () => async (tree: Root) => {
	const { visit } = await import('unist-util-visit')

	visit(tree, 'html', (node: Html) => {
		node.value = node.value.replace(/\[\[(.+?)\]\]/g, (_match, raw) => {
			const { href, exists, displayText } = resolveBracketContent(wikiIndex, raw)
			const className = exists ? 'internal' : 'internal new'
			return `<a class="${className}" href="${href}">${displayText}</a>`
		})
	})
}

const createWikiLinkDisplayPlugin = () => () => async (tree: Root) => {
	const { visit } = await import('unist-util-visit')

	visit(tree, 'wikiLink', (node: WikiLinkNode) => {
		if (!node.data) return
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
	createWikiLinkDisplayPlugin(),
	createHtmlWikiLinkPlugin(wikiIndex)
]
