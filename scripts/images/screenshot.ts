import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Command } from 'commander'
import { readContentFiles, readFrontmatter } from '../../src/markdoc/wikilinks.ts'
import { addImage, root } from './addImage.ts'

const chrome =
	process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const program = new Command()
	.name('screenshot')
	.description("Take a screenshot of a page's url with headless Chrome, and add it to the page.")
	.argument('<page>', 'id of the page, for example showroom')
	.option('--url <url>', "website to capture (default: the page's url)")
	.option('--width <pixels>', 'browser width', Number, 1280)
	.option('--height <pixels>', 'browser height', Number, 800)
	.option('--wait <ms>', 'time to let the website load', Number, 5000)
	.option('--caption <text>', 'caption under the image')
	.option('--alt <text>', 'alt text')
	.option('--wiki-image', 'use <WikiImage> instead of a markdown image')
	.action((pageId: string, options) => {
		const page = readContentFiles(join(root, 'src/content')).find(({ id }) => id === pageId)
		if (!page) throw new Error(`no page with the id "${pageId}" in src/content`)

		const frontmatter = readFrontmatter(readFileSync(page.file, 'utf-8')) as {
			url?: string
		} | null
		const url: string | undefined = options.url ?? frontmatter?.url
		if (!url?.startsWith('http')) throw new Error('the page has no http url; use --url')

		const directory = mkdtempSync(join(tmpdir(), 'screenshot-'))
		const file = join(directory, 'screenshot.png')

		try {
			const result = spawnSync(
				chrome,
				[
					'--headless=new',
					'--disable-gpu',
					'--hide-scrollbars',
					'--force-device-scale-factor=1',
					`--window-size=${options.width},${options.height}`,
					`--virtual-time-budget=${options.wait}`,
					`--screenshot=${file}`,
					url
				],
				{ encoding: 'utf-8' }
			)
			if (result.status !== 0) {
				throw new Error(`Chrome failed: ${result.stderr || result.error?.message}`)
			}

			const { src } = addImage({
				source: file,
				pageId,
				name: `${pageId}-screenshot`,
				wikiImage: options.wikiImage,
				caption: options.caption,
				alt: options.alt,
				maxSize: options.width
			})
			console.log(`Added a screenshot of ${url} as ${src} to ${page.file}`)
		} finally {
			rmSync(directory, { recursive: true, force: true })
		}
	})

try {
	await program.parseAsync()
} catch (error) {
	program.error((error as Error).message)
}
