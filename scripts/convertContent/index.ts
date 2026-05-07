/// <reference types="node" />

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'
import sharp from 'sharp'
import { dirname } from 'node:path'

export const formatDate = (date: Date) => {
	return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
}

function convertToUrl(value: string) {
	return value
		.replace(/[^a-z0-9_]+/gi, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase()
}

export type Project = {
	title: string
	date: Date
	flag?: string
	rating?: number
	imageSrc?: string | string[]
	youtubeId?: string
	collaborators?: { name: string; url?: string }[]
	description?: string
	links?: Record<string, string>
}

const convert = async () => {
	const BASE_DIR = 'scripts/convertContent/old'

	const subDirs = await readdir(BASE_DIR)

	let filePaths: string[] = []

	for (const dir of subDirs) {
		const dirs = (await readdir(`${BASE_DIR}/${dir}`)).map((path) => {
			return `${BASE_DIR}/${dir}/${path}`
		})

		filePaths = filePaths.concat(dirs)
	}

	for (const path of filePaths) {
		const yamlStr = await readFile(path, { encoding: 'utf-8' })

		const type = path.split('/').at(-2)!

		const data = yaml.load(yamlStr) as Project

		const imagesToConvert: string[] = []

		const switchToWebp = (str: string) => str.split('.')[0] + '.webp'

		const convertImagePath = () => {
			if (!data.imageSrc) {
				return ''
			}

			if (typeof data.imageSrc === 'string') {
				imagesToConvert.push(data.imageSrc)

				return `![](${switchToWebp(data.imageSrc)})`
			}

			imagesToConvert.push(...data.imageSrc)

			return data.imageSrc.map((src) => `![](${switchToWebp(src)})`).join('\n')
		}

		const imageMarkdown = convertImagePath()

		// await Promise.all(
		// 	imagesToConvert.map(async (imagePath) => {
		// 		const absolutePath = `scripts/convertContent${imagePath}`
		// 		const fileName = imagePath.split('.')[0]

		// 		const image = sharp(await readFile(absolutePath)).webp({
		// 			nearLossless: true,
		// 			quality: 67,
		// 			effort: 6
		// 		})

		// 		if ((await image.metadata()).width > 960) image.resize(960)

		// 		const outPath = `scripts/convertContent/new/${fileName}.webp`
		// 		await mkdir(dirname(outPath), { recursive: true })
		// 		await image.toFile(outPath)
		// 	})
		// )

		let music: Object | undefined

		const convertLinks = () => {
			if (!data.links) {
				return undefined
			}

			const entries = Object.entries(data.links)

			if (entries.length === 1) {
				return `${entries[0][1]}`
			}

			if ('bandcamp' in data.links) {
				music = data.links
			}
		}

		const frontMatter = {
			title: data.title,
			date: formatDate(data.date),
			youtubeId: data.youtubeId,
			rating: data.rating,
			collaborators: data.collaborators,
			link: convertLinks(),
			type,
			music
		}

		const out = `
---
${yaml.dump(frontMatter)}
---

${imageMarkdown}

${data.description}
		`.trim()

		const fileName = `${convertToUrl(data.title)}.md`

		await writeFile(`scripts/convertContent/new/${fileName}`, out)
	}
}

convert()
