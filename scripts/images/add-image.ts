import { Command, Option } from 'commander'
import { addImage, isVideo } from './addImage.ts'

const program = new Command()
	.name('add-image')
	.description(
		'Convert an image to WebP, or a video (.mov, .mp4, .m4v, .webm, .mkv, .avi) to WebM, with the metadata removed. Save it in static/images/wiki/, and add it to the top of a page.'
	)
	.argument('<file>', 'path to the image or video file')
	.argument('<page>', 'id of the page, for example public-transport')
	.option('--wiki-image', 'images: use <WikiImage> (a framed image) instead of a markdown image')
	.option(
		'--autoplay',
		'videos: play silently on a loop, with no controls (the sound is removed)'
	)
	.option(
		'--high',
		'videos: high quality (1280px, up to 30 fps, constant quality, stereo sound); other video options override it'
	)
	.option(
		'--poster-at <seconds>',
		'videos without --autoplay: time of the frame for the poster image (default: 1)',
		Number
	)
	.option('--caption <text>', 'caption under the image or video')
	.option('--alt <text>', 'images: alt text')
	.addOption(
		new Option('--align <side>', 'position of a <WikiImage> or <WikiVideo>').choices([
			'left',
			'right',
			'center'
		])
	)
	.option('--name <name>', 'file name without extension (default: the page id)')
	.option(
		'--max <pixels>',
		'largest width or height (default: 1600 for images, 640 for videos, 1280 with --high)',
		Number
	)
	.option('--quality <number>', 'images: WebP quality (default: 82)', Number)
	.option(
		'--target-kb <number>',
		'videos: approximate file size in kilobytes (default: 100; with --high, replaces constant quality)',
		Number
	)
	.option(
		'--crf <number>',
		'videos: constant VP9 quality instead of a size target, lower is better and larger (32 with --high)',
		Number
	)
	.option(
		'--fps <number>',
		'videos: maximum frames per second (default: 24, or 30 with --high)',
		Number
	)
	.action((file: string, page: string, options) => {
		if (isVideo(file) && (options.wikiImage || options.alt)) {
			console.warn('Videos always use <WikiVideo>, so --wiki-image and --alt are ignored.')
		}
		if (
			!isVideo(file) &&
			(options.autoplay ||
				options.high ||
				options.posterAt !== undefined ||
				options.crf ||
				options.fps ||
				options.targetKb)
		) {
			console.warn(
				'--autoplay, --high, --poster-at, --target-kb, --crf and --fps are only for videos, so they are ignored.'
			)
		}
		if (options.autoplay && options.posterAt !== undefined) {
			console.warn('Autoplay videos have no poster, so --poster-at is ignored.')
		}
		if (options.crf !== undefined && options.targetKb !== undefined) {
			console.warn('--crf replaces the size target, so --target-kb is ignored.')
		}

		const {
			src,
			poster,
			page: pageFile
		} = addImage({
			source: file,
			pageId: page,
			wikiImage: options.wikiImage,
			autoplay: options.autoplay,
			caption: options.caption,
			alt: options.alt,
			align: options.align,
			name: options.name,
			maxSize: options.max,
			quality: options.quality,
			crf: options.crf,
			fps: options.fps,
			targetKb: options.targetKb,
			high: options.high,
			posterAt: options.posterAt
		})
		console.log(`Added ${src}${poster ? ` with the poster ${poster}` : ''} to ${pageFile}`)
	})

try {
	await program.parseAsync()
} catch (error) {
	program.error((error as Error).message)
}
