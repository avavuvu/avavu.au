import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '../lib/components/wiki')

export const buildWikiComponentImports = () => {
	let files: string[]
	try {
		files = readdirSync(componentsDir).filter((file) => file.endsWith('.svelte'))
	} catch {
		return ''
	}

	return files
		.map((file) => {
			const name = file.replace(/\.svelte$/, '')
			return `import ${name} from '$lib/components/wiki/${name}.svelte'`
		})
		.join('\n')
}
