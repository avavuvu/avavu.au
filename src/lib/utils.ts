export const yearsSince = (date: string | Date, now = new Date()) => {
	const start = new Date(date)
	const years = now.getFullYear() - start.getFullYear()
	const birthdayPassed =
		now.getMonth() > start.getMonth() ||
		(now.getMonth() === start.getMonth() && now.getDate() >= start.getDate())
	return birthdayPassed ? years : years - 1
}

export const formatDate = (date: Date) => {
	return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
}
