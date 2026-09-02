declare module 'remark-wiki-link/lib/index.js' {
	type Options = {
		aliasDivider?: string
		permalinks?: string[]
		pageResolver?: (name: string) => string[]
		hrefTemplate?: (permalink: string) => string
	}

	const wikiLinkPlugin: (options?: Options) => unknown

	export default wikiLinkPlugin
}
