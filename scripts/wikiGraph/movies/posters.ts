import { access, mkdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

type SavedPoster = {
	path?: string
	downloaded: boolean
}

const exists = (file: string) =>
	access(file).then(
		() => true,
		() => false
	)

export const createPosterStore = async (dir: string, urlPrefix: string) => {
	await mkdir(dir, { recursive: true })

	return async (src: string): Promise<SavedPoster> => {
		const filename = basename(new URL(src).pathname)
		const file = join(dir, filename)
		const path = `${urlPrefix}/${filename}`

		if (await exists(file)) return { path, downloaded: false }

		try {
			const response = await fetch(src)
			if (!response.ok) throw new Error(`status ${response.status}`)
			await writeFile(file, new Uint8Array(await response.arrayBuffer()))
			return { path, downloaded: true }
		} catch (error) {
			console.warn(`Could not download ${src}: ${error}`)
			return { downloaded: false }
		}
	}
}
