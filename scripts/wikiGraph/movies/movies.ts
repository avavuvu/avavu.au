import Parser from 'rss-parser'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Movie } from '../../../src/lib/index.ts'
import { createPosterStore } from './posters.ts'

const MOVIES_LIMIT = 7;

type FeedItem = {
	filmTitle?: string
	filmYear?: string
	rating?: string
	watched?: string
}

const parser = new Parser<unknown, FeedItem>({
	customFields: {
		item: [
			['letterboxd:filmTitle', 'filmTitle'],
			['letterboxd:filmYear', 'filmYear'],
			['letterboxd:memberRating', 'rating'],
			['letterboxd:watchedDate', 'watched']
		]
	}
})

const posterParagraph = /<p>\s*<img[^>]*>\s*<\/p>/i
const watchedParagraph = /<p>\s*(?:re)?watched on [^<]*<\/p>/i

export const buildMovies = async (root: string) => {
	const outPath = join(root, 'src/lib/movies.json')
	const existing = await readFile(outPath, 'utf8')
		.then((text) => JSON.parse(text) as Movie[])
		.catch(() => [] as Movie[])

	const feed = await parser.parseURL('https://letterboxd.com/avasamerica/rss').catch((error) => {
		console.warn(`Could not fetch the Letterboxd feed: ${error}`)
	})

	if (!feed) {
		await writeFile(outPath, JSON.stringify(existing))
		return
	}

	const savePoster = await createPosterStore(join(root, 'static/posters'), '/posters')
	const byId = new Map(existing.map((movie) => [movie.id, movie]))
	let downloaded = 0

	for (const item of feed.items.slice(0,MOVIES_LIMIT)) {
		if (!item.filmTitle || !item.link) continue

		const id = item.guid ?? item.link
		const html = item.content ?? ''
		const src = html.match(/<img\s+src="([^"]+)"/)?.[1]
		const poster = src ? await savePoster(src) : undefined
		if (poster?.downloaded) downloaded++

		byId.set(id, {
			id,
			title: item.filmTitle,
			year: item.filmYear ? Number(item.filmYear) : undefined,
			url: item.link,
			watched: item.watched ?? item.isoDate?.slice(0, 10) ?? '',
			rating: item.rating ? Number(item.rating) : undefined,
			comment: html.replace(posterParagraph, '').replace(watchedParagraph, '').trim() || undefined,
			image: poster?.path ?? byId.get(id)?.image
		})
	}

	const movies = [...byId.values()].sort((a, b) => b.watched.localeCompare(a.watched))
	await writeFile(outPath, JSON.stringify(movies))
	console.log(`Movies: ${movies.length} films, ${downloaded} new posters`)
}
