import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join, relative } from 'node:path'
import { readContentFiles } from '../../src/markdoc/wikilinks.ts'

export const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const contentRoot = join(root, 'src/content')
const imageRoot = join(root, 'static/images/wiki')

export type AddImageOptions = {
	source: string
	pageId: string
	name?: string
	caption?: string
	alt?: string
	wikiImage?: boolean
	align?: 'left' | 'right' | 'center'
	maxSize?: number
	quality?: number
}

const run = (command: string, args: string[]) => {
	const result = spawnSync(command, args, { encoding: 'utf-8' })
	if (result.status !== 0) {
		throw new Error(`${command} failed: ${result.stderr || result.error?.message}`)
	}
	return result.stdout
}

const looseName = (name: string) => name.normalize('NFC').replace(/[\u00a0\u202f]/g, ' ')

const resolveSource = (path: string) => {
	if (existsSync(path)) return path

	const wanted = looseName(basename(path))
	const match = existsSync(dirname(path))
		? readdirSync(dirname(path)).find((name) => looseName(name) === wanted)
		: undefined
	if (!match) throw new Error(`no file at "${path}"`)
	return join(dirname(path), match)
}

const freePath = (name: string) => {
	let candidate = join(imageRoot, `${name}.webp`)
	for (let n = 2; existsSync(candidate); n++) candidate = join(imageRoot, `${name}-${n}.webp`)
	return candidate
}

const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const markupFor = (src: string, { caption, alt = '', wikiImage, align }: AddImageOptions) => {
	if (!wikiImage) {
		const image = `![${alt.replace(/]/g, '\\]')}](${src})`
		return caption ? `${image}\n\n*${caption}*` : image
	}

	const attributes = [
		`src="${src}"`,
		`alt="${escapeAttribute(alt)}"`,
		align && align !== 'right' ? `align="${align}"` : ''
	]
		.filter(Boolean)
		.join(' ')

	return caption
		? `<WikiImage ${attributes}>\n    ${caption}\n</WikiImage>`
		: `<WikiImage ${attributes} />`
}

const insertIntoBody = (source: string, markup: string) => {
	const match = source.match(/^---\n[\s\S]*?\n---\n/)
	if (!match) throw new Error('the page has no frontmatter')

	const lines = source.slice(match[0].length).split('\n')
	let index = 0
	while (index < lines.length && (lines[index].trim() === '' || /^<Wikipedia\b/.test(lines[index]))) {
		index++
	}

	const before = lines.slice(0, index).join('\n').replace(/\n+$/, '')
	const after = lines.slice(index).join('\n').replace(/^\n+/, '')
	return `${match[0]}${before ? `${before}\n\n` : '\n'}${markup}\n\n${after}`.replace(/\n*$/, '\n')
}

export const addImage = (options: AddImageOptions) => {
	const page = readContentFiles(contentRoot).find(({ id }) => id === options.pageId)
	if (!page) throw new Error(`no page with the id "${options.pageId}" in src/content`)
	const source = resolveSource(options.source)

	mkdirSync(imageRoot, { recursive: true })
	const output = freePath(options.name ?? options.pageId)
	const size = options.maxSize ?? 1600

	run('magick', [
		source,
		'-auto-orient',
		'-strip',
		'-resize',
		`${size}x${size}>`,
		'-quality',
		String(options.quality ?? 82),
		output
	])

	const src = `/${relative(join(root, 'static'), output)}`
	writeFileSync(page.file, insertIntoBody(readFileSync(page.file, 'utf-8'), markupFor(src, options)))

	return { src, output, page: page.file }
}

