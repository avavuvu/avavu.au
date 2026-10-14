import { spawnSync } from 'node:child_process'
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync
} from 'node:fs'
import { devNull, tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { basename, dirname, extname, join, relative } from 'node:path'
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
	autoplay?: boolean
	crf?: number
	fps?: number
	targetKb?: number
}

const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.m4v', '.webm', '.mkv', '.avi']

export const isVideo = (path: string) => VIDEO_EXTENSIONS.includes(extname(path).toLowerCase())

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

const freePath = (name: string, extension: string) => {
	let candidate = join(imageRoot, `${name}.${extension}`)
	for (let n = 2; existsSync(candidate); n++) {
		candidate = join(imageRoot, `${name}-${n}.${extension}`)
	}
	return candidate
}

const escapeAttribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const videoMarkupFor = (src: string, { caption, autoplay, align }: AddImageOptions) => {
	const attributes = [
		`src="${src}"`,
		autoplay ? 'autoplay' : '',
		align && align !== 'right' ? `align="${align}"` : ''
	]
		.filter(Boolean)
		.join(' ')

	return caption
		? `<WikiVideo ${attributes}>\n    ${caption}\n</WikiVideo>`
		: `<WikiVideo ${attributes} />`
}

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
	while (
		index < lines.length &&
		(lines[index].trim() === '' || /^<Wikipedia\b/.test(lines[index]))
	) {
		index++
	}

	const before = lines.slice(0, index).join('\n').replace(/\n+$/, '')
	const after = lines.slice(index).join('\n').replace(/^\n+/, '')
	return `${match[0]}${before ? `${before}\n\n` : '\n'}${markup}\n\n${after}`.replace(
		/\n*$/,
		'\n'
	)
}

const convertImage = (source: string, output: string, options: AddImageOptions) => {
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
}

const AUDIO_BITRATE = 48_000
const MIN_VIDEO_BITRATE = 120_000
const MAX_VIDEO_BITRATE = 2_000_000

const durationOf = (source: string) =>
	Number(
		run('ffprobe', [
			'-v',
			'error',
			'-show_entries',
			'format=duration',
			'-of',
			'default=noprint_wrappers=1:nokey=1',
			source
		]).trim()
	)

export const videoBitrate = (source: string, options: AddImageOptions) => {
	const seconds = durationOf(source)
	const totalBits = (options.targetKb ?? 100) * 1024 * 8
	const audioBits = options.autoplay ? 0 : AUDIO_BITRATE * seconds
	const bitrate = (totalBits - audioBits) / seconds
	return Math.round(Math.min(MAX_VIDEO_BITRATE, Math.max(MIN_VIDEO_BITRATE, bitrate)))
}

export const convertVideo = (source: string, output: string, options: AddImageOptions) => {
	const size = options.maxSize ?? 640
	const passLog = join(mkdtempSync(join(tmpdir(), 'add-image-')), 'pass')

	const common = [
		'-v',
		'error',
		'-y',
		'-i',
		source,
		'-map_metadata',
		'-1',
		'-map_chapters',
		'-1',
		'-vf',
		`fps=${options.fps ?? 24},scale='min(iw,${size})':'min(ih,${size})':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`,
		'-c:v',
		'libvpx-vp9',
		...(options.crf === undefined
			? ['-b:v', String(videoBitrate(source, options))]
			: ['-crf', String(options.crf), '-b:v', '0']),
		'-row-mt',
		'1',
		'-deadline',
		'good',
		'-passlogfile',
		passLog
	]

	try {
		run('ffmpeg', [...common, '-cpu-used', '4', '-pass', '1', '-an', '-f', 'null', devNull])
		run('ffmpeg', [
			...common,
			'-cpu-used',
			'1',
			'-pass',
			'2',
			...(options.autoplay
				? ['-an']
				: ['-c:a', 'libopus', '-b:a', String(AUDIO_BITRATE), '-ac', '1']),
			output
		])
	} finally {
		rmSync(dirname(passLog), { recursive: true, force: true })
	}
}

export const addImage = (options: AddImageOptions) => {
	const page = readContentFiles(contentRoot).find(({ id }) => id === options.pageId)
	if (!page) throw new Error(`no page with the id "${options.pageId}" in src/content`)
	const source = resolveSource(options.source)

	mkdirSync(imageRoot, { recursive: true })
	const video = isVideo(source)
	const output = freePath(options.name ?? options.pageId, video ? 'webm' : 'webp')

	if (video) convertVideo(source, output, options)
	else convertImage(source, output, options)

	const src = `/${relative(join(root, 'static'), output)}`
	const markup = video ? videoMarkupFor(src, options) : markupFor(src, options)
	writeFileSync(page.file, insertIntoBody(readFileSync(page.file, 'utf-8'), markup))

	return { src, output, page: page.file }
}
