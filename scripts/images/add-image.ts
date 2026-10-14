import { Command, Option } from 'commander'
import { addImage } from './addImage.ts'

const program = new Command()
	.name('add-image')
	.description(
		'Convert an image to WebP (rotated, metadata removed), save it in static/images/wiki/, and add it to the top of a page.'
	)
	.argument('<image>', 'path to the image file')
	.argument('<page>', 'id of the page, for example public-transport')
	.option('--wiki-image', 'use <WikiImage> (a framed image) instead of a markdown image')
	.option('--caption <text>', 'caption under the image')
	.option('--alt <text>', 'alt text')
	.addOption(
		new Option('--align <side>', 'position of a <WikiImage>').choices(['left', 'right', 'center'])
	)
	.option('--name <name>', 'file name without extension (default: the page id)')
	.option('--max <pixels>', 'largest width or height', Number, 1600)
	.option('--quality <number>', 'WebP quality', Number, 82)
	.action((image: string, page: string, options) => {
		const { src, page: file } = addImage({
			source: image,
			pageId: page,
			wikiImage: options.wikiImage,
			caption: options.caption,
			alt: options.alt,
			align: options.align,
			name: options.name,
			maxSize: options.max,
			quality: options.quality
		})
		console.log(`Added ${src} to ${file}`)
	})

try {
	await program.parseAsync()
} catch (error) {
	program.error((error as Error).message)
}
