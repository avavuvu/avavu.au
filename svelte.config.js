import { mdsvex } from 'mdsvex'
import adapter from '@sveltejs/adapter-static'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildWikiIndex } from './src/markdoc/wikilinks.ts'
import { createWikiRemarkPlugins } from './src/markdoc/wikiRemarkPlugins.ts'
import { buildWikiComponentImports } from './src/markdoc/wikiComponents.ts'

const wikiRoot = join(dirname(fileURLToPath(import.meta.url)), 'src/wiki')
const { index: wikiIndex } = buildWikiIndex(wikiRoot)
const wikiComponentImports = buildWikiComponentImports()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@assets/*': './src/assets/*',
			'@/*': './src/components/*'
		}
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			smartypants: true,
			remarkPlugins: [
				// this is a dodgy bit of code to stop a crash with the {{name}} handlebars templating
				// putting it anywhere crashes so.. it lives here
				() => async (tree) => {
					const { visit } = await import('unist-util-visit')
					visit(tree, 'text', (node) => {
						node.value = node.value.replace('{{name}}', 'Web Surfer')
					})
				},
				...createWikiRemarkPlugins(wikiIndex)
			]
		}),
		{
            script: ({ content, filename }) => {
                // add the wiki component import to every wiki page
                // so we don't need to manually add
				if (!filename || !filename.includes('/src/wiki/')) return
				return { code: `${wikiComponentImports}\n${content}` }
			}
		}
	],
	extensions: ['.svelte', '.svx', '.md']
}

export default config
