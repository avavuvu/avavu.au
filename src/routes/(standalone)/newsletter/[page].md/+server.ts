import { agentMarkdownSegments, serveAgentMarkdown } from '$lib/server/agentMarkdown'

export const prerender = true

export const entries = async () =>
	(await agentMarkdownSegments(2, (section) => section === 'newsletter')).map(([, page]) => ({
		page
	}))

export const GET = ({ params }) => serveAgentMarkdown(`/newsletter/${params.page}`)
