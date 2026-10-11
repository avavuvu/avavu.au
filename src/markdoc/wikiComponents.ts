import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/components/wiki')

const componentNames = () => {
	try {
		return readdirSync(componentsDir)
			.filter((file) => file.endsWith('.svelte'))
			.map((file) => file.replace(/\.svelte$/, ''))
	} catch {
		return []
	}
}

export const buildWikiComponentImports = (markup: string) =>
	componentNames()
		.filter((name) => new RegExp(`<${name}[\\s/>]`).test(markup))
		.map((name) => `import ${name} from '$lib/components/wiki/${name}.svelte'`)
		.join('\n')
