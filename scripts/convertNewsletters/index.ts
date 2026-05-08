/// <reference types="node" />

import sharp from 'sharp'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const convertNewsletters = async () => {
	const BASE_DIR = 'scripts/convertNewsletters'

	const newsletters = await readdir(`${BASE_DIR}/old/newsletter`)

	const imgRegex = /!\[.*?\]\((.*?)\)/g

	const images: { original: string; webp: string }[] = []

	for (const path of newsletters) {
		const newsletter = await readFile(`${BASE_DIR}/old/newsletter/${path}`, {
			encoding: 'utf-8'
		})

		const updated = newsletter.replace(imgRegex, (match, src) => {
			const original = src.replace('https://avavu.au/', '')

			const webp = src
				.replace('https://avavu.au/', '')
				.replace(/\.(png|jpg|jpeg|gif|avif)$/i, '.webp')

			images.push({ original, webp })
			return match.replace(src, webp)
		})

		const outPath = `scripts/convertNewsletters/new/${path}`
		await mkdir(dirname(outPath), { recursive: true })
		await writeFile(outPath, updated)
	}

	await Promise.all(
		images.map(async ({ original, webp }) => {
			const absolutePath = `${BASE_DIR}/old/${original}`

			try {
				const file = await readFile(absolutePath)
				const fileName = original.split('/').at(-1)!.split('.')[0]
				const outPath = `scripts/convertNewsletters/new/images/newsletter/${fileName}.webp`

				console.log('writing to:', outPath)
				await mkdir(dirname(outPath), { recursive: true })
				await sharp(file)
					.webp({ nearLossless: true, quality: 67, effort: 6 })
					.toFile(outPath)
			} catch (e) {
				console.error('failed on:', absolutePath, e)
			}
		})
	)
}

convertNewsletters()
