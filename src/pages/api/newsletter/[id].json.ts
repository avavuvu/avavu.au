
import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { getCollection } from "astro:content"

export async function getStaticPaths() {
    const newsletter = await getCollection("newsletter")
    
    return newsletter.map(({id}) => ({
        params: { id }
    }))
}

export const GET: APIRoute = async ({ params, request }) => {
    const { id } = params

    if(!id) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    const entry = await getEntry("newsletter", id)

    if(!entry) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    return new Response(JSON.stringify({
        markdown: entry.body,
        data: entry.data
    }), {
        status: 200
    })
}