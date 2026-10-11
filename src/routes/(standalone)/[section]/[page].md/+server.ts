import { agentMarkdownSegments, serveAgentMarkdown } from '$lib/server/agentMarkdown'
import { sectionsWithOwnChildRoutes } from '$lib/wikiCategory'

export const prerender = true

export const entries = async () =>
	(
		await agentMarkdownSegments(2, (section) => !sectionsWithOwnChildRoutes.includes(section))
	).map(([section, page]) => ({ section, page }))

export const GET = ({ params }) => serveAgentMarkdown(`/${params.section}/${params.page}`)
