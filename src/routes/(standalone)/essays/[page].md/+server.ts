import { agentMarkdownSegments, serveAgentMarkdown } from '$lib/server/agentMarkdown'

export const prerender = true

export const entries = async () =>
	(await agentMarkdownSegments(2, (section) => section === 'essays')).map(([, page]) => ({
		page
	}))

export const GET = ({ params }) => serveAgentMarkdown(`/essays/${params.page}`)
