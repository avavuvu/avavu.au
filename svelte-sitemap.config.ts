import type { OptionsSvelteSitemap } from 'svelte-sitemap'

const config: OptionsSvelteSitemap = {
	domain: 'https://www.avavu.au',
	trailingSlashes: true,
	ignore: ['**/archive/rating/**', '**/archive/year/**']
}

export default config
