export const youtubeIdFrom = (url: string | undefined) =>
	url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1]

export const yearsSince = (date: string | Date, now = new Date()) => {
	const start = new Date(date)
	const years = now.getFullYear() - start.getFullYear()
	const birthdayPassed =
		now.getMonth() > start.getMonth() ||
		(now.getMonth() === start.getMonth() && now.getDate() >= start.getDate())
	return birthdayPassed ? years : years - 1
}
