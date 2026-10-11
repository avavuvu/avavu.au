import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { z } from 'zod'

const cacheDir = join(process.cwd(), '.cache')

const cachePathFor = (key: string) => join(cacheDir, `${key}.json`)

export const fetchJsonCached = async <S extends z.ZodType, F>(
	url: string,
	cacheKey: string,
	schema: S,
	fallback: F
): Promise<z.output<S> | F> => {
	const cachePath = cachePathFor(cacheKey)

	try {
		const cached = schema.safeParse(JSON.parse(await readFile(cachePath, 'utf-8')))
		if (cached.success) return cached.data
	} catch {}

	try {
		const res = await fetch(url)
		if (!res.ok) return fallback

		const raw = await res.json()
		const parsed = schema.safeParse(raw)
		if (!parsed.success) return fallback

		await mkdir(cacheDir, { recursive: true })
		await writeFile(cachePath, JSON.stringify(raw, null, 2))

		return parsed.data
	} catch {
		return fallback
	}
}
