import type { APIRoute } from "astro"
import { getCollection, getEntry } from "astro:content"
import { allProjects } from "../../../lib/projectCollection"
import convertToUrl from "../../../lib/util/convertToUrl"

export async function getStaticPaths() {

    return allProjects.map(({data}) => {
        return { 
            params: {
                id: convertToUrl(data.title)
            }
        }
        
    })
}


export const GET: APIRoute = async ({ params, request }) => {
    const { id } = params

    if(!id) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    const entry = allProjects.find((project) => convertToUrl(project.data.title) === id)

    if(!entry) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    return new Response(JSON.stringify({
        data: entry.data
    }), {
        status: 200
    })
}