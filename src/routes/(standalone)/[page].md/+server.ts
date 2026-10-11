import { agentMarkdownSegments, serveAgentMarkdown } from '$lib/server/agentMarkdown'

export const prerender = true

export const entries = async () =>
	(await agentMarkdownSegments(1, () => true)).map(([page]) => ({ page }))

export const GET = ({ params }) => serveAgentMarkdown(`/${params.page}`)
