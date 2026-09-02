import type { OptionsSvelteSitemap } from 'svelte-sitemap'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildWikiIndex } from './src/markdoc/wikilinks.ts'

const wikiRoot = join(dirname(fileURLToPath(import.meta.url)), 'src/wiki')
const { aliasPaths } = buildWikiIndex(wikiRoot)

const config: OptionsSvelteSitemap = {
	domain: 'https://www.avavu.au',
	trailingSlashes: true,
	ignore: [
		'**/archive/rating/**',
		'**/archive/year/**',
		'**/wiki/random**',
		...aliasPaths.map((path) => `${path.slice(1)}.html`)
	]
}

export default config
