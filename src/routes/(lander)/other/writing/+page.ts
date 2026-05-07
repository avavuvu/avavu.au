import { getMarkdocContent } from '$lib/markdoc.js'

export const load = async ({ params }) => {
	// ugly code, just want to standardize it to all be metadata
	const writing = getMarkdocContent()

	return {
		writing
	}
}
