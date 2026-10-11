import { getLlmsTxt } from '$lib/server/agentMarkdown'

export const prerender = true

export const GET = async () =>
	new Response(await getLlmsTxt(), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	})
