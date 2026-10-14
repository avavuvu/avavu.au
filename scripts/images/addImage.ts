import { spawnSync } from 'node:child_process'
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
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
	high?: boolean
	posterAt?: number
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

const videoMarkupFor = (
	src: string,
	poster: string | undefined,
	{ caption, autoplay, align }: AddImageOptions
) => {
	const attributes = [
		`src="${src}"`,
		poster ? `poster="${poster}"` : '',
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

const MIN_VIDEO_BITRATE = 120_000
const MAX_VIDEO_BITRATE = 2_000_000
const DEFAULT_POSTER_AT = 1

const STANDARD_VIDEO = { maxSize: 640, fps: 24, audioBitrate: 48_000, audioChannels: 1 }
const HIGH_VIDEO = { maxSize: 1280, fps: 30, audioBitrate: 128_000, audioChannels: 2, crf: 32 }

const videoSettings = (options: AddImageOptions) => {
	const preset = options.high ? HIGH_VIDEO : STANDARD_VIDEO
	return {
		maxSize: options.maxSize ?? preset.maxSize,
		fps: options.fps ?? preset.fps,
		crf:
			options.crf ??
			(options.high && options.targetKb === undefined ? HIGH_VIDEO.crf : undefined),
		audio: options.autoplay
			? undefined
			: { bitrate: preset.audioBitrate, channels: preset.audioChannels }
	}
}

const probe = (source: string, entries: string, stream = false) =>
	run('ffprobe', [
		'-v',
		'error',
		...(stream ? ['-select_streams', 'v:0'] : []),
		'-show_entries',
		entries,
		'-of',
		'default=noprint_wrappers=1:nokey=1',
		source
	]).trim()

const durationOf = (source: string) => Number(probe(source, 'format=duration'))

const frameRateOf = (source: string) => {
	const [numerator, denominator = 1] = probe(source, 'stream=avg_frame_rate', true)
		.split('/')
		.map(Number)
	const rate = numerator / denominator
	return Number.isFinite(rate) && rate > 0 ? rate : undefined
}

const scaleFilter = (size: number) =>
	`scale='min(iw,${size})':'min(ih,${size})':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2`

const videoBitrate = (seconds: number, targetKb: number, audioBitrate: number) => {
	const bitrate = (targetKb * 1024 * 8 - audioBitrate * seconds) / seconds
	return Math.round(Math.min(MAX_VIDEO_BITRATE, Math.max(MIN_VIDEO_BITRATE, bitrate)))
}

export const extractPoster = (source: string, output: string, options: AddImageOptions) => {
	const at = options.posterAt ?? Math.min(DEFAULT_POSTER_AT, durationOf(source) / 2)
	run('ffmpeg', [
		'-v',
		'error',
		'-y',
		'-ss',
		String(at),
		'-i',
		source,
		'-map_metadata',
		'-1',
		'-frames:v',
		'1',
		'-vf',
		scaleFilter(videoSettings(options).maxSize),
		'-c:v',
		'libwebp',
		'-quality',
		String(options.quality ?? 82),
		output
	])
	if (!existsSync(output) || statSync(output).size === 0) {
		rmSync(output, { force: true })
		throw new Error(`no frame at ${at} seconds; use a smaller --poster-at`)
	}
}

export const convertVideo = (source: string, output: string, options: AddImageOptions) => {
	const settings = videoSettings(options)
	const sourceRate = frameRateOf(source)
	const fps = sourceRate ? Math.min(sourceRate, settings.fps) : settings.fps
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
		`fps=${fps},${scaleFilter(settings.maxSize)}`,
		'-c:v',
		'libvpx-vp9',
		...(settings.crf === undefined
			? [
					'-b:v',
					String(
						videoBitrate(
							durationOf(source),
							options.targetKb ?? 100,
							settings.audio?.bitrate ?? 0
						)
					)
				]
			: ['-crf', String(settings.crf), '-b:v', '0']),
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
			...(settings.audio
				? [
						'-c:a',
						'libopus',
						'-b:a',
						String(settings.audio.bitrate),
						'-ac',
						String(settings.audio.channels)
					]
				: ['-an']),
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

	const video = isVideo(source)
	if (video && options.posterAt !== undefined && options.posterAt >= durationOf(source)) {
		throw new Error(`--poster-at must be less than the video length (${durationOf(source)} s)`)
	}

	mkdirSync(imageRoot, { recursive: true })
	const output = freePath(options.name ?? options.pageId, video ? 'webm' : 'webp')

	const publicPath = (file: string) => `/${relative(join(root, 'static'), file)}`
	let poster: string | undefined

	if (video) {
		convertVideo(source, output, options)
		if (!options.autoplay) {
			const posterFile = freePath(`${basename(output, '.webm')}-poster`, 'webp')
			extractPoster(source, posterFile, options)
			poster = publicPath(posterFile)
		}
	} else {
		convertImage(source, output, options)
	}

	const src = publicPath(output)
	const markup = video ? videoMarkupFor(src, poster, options) : markupFor(src, options)
	writeFileSync(page.file, insertIntoBody(readFileSync(page.file, 'utf-8'), markup))

	return { src, poster, output, page: page.file }
}
