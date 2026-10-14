import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const componentsRoot = join(dirname(fileURLToPath(import.meta.url)), '../lib/components')

const componentFolders = ['wiki', 'longform']

const components = () =>
	componentFolders.flatMap((folder) => {
		try {
			return readdirSync(join(componentsRoot, folder))
				.filter((file) => file.endsWith('.svelte'))
				.map((file) => ({ name: file.replace(/\.svelte$/, ''), folder }))
		} catch {
			return []
		}
	})

export const buildWikiComponentImports = (markup: string) =>
	components()
		.filter(({ name }) => new RegExp(`<${name}[\\s/>]`).test(markup))
		.map(({ name, folder }) => `import ${name} from '$lib/components/${folder}/${name}.svelte'`)
		.join('\n')
