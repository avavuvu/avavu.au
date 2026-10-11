import type { OptionsSvelteSitemap } from 'svelte-sitemap'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildWikiIndex } from './src/markdoc/wikilinks.ts'
import graph from './src/lib/wikiGraph.json' with { type: 'json' }

const wikiRoot = join(dirname(fileURLToPath(import.meta.url)), 'src/wiki')
const { aliasPaths } = buildWikiIndex(wikiRoot)

const config: OptionsSvelteSitemap = {
	domain: 'https://www.avavu.au',
	trailingSlashes: true,
	ignore: [
		'random.html',
		'patreon/**',
		...Object.entries(graph.paths as Record<string, string>)
			.filter(([id, path]) => path !== `/${id}`)
			.map(([id]) => `${id}.html`),
		...aliasPaths.map((path) => `${path.slice(1)}.html`)
	]
}

export default config
