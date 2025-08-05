import type { APIRoute } from "astro"
import { getCollection, getEntry } from "astro:content"
import { allProjects } from "../../../../lib/projectCollection"
import type { ProjectData } from "@t/*"

export async function getStaticPaths() {
    const years = new Set<string>()

    for(const project of allProjects) {
        years.add(project.data.date.getFullYear().toString())
    }
    
    return [...years].map(year => ({
        params: {
            year
        }
    }))
}


export const GET: APIRoute = async ({ params, request }) => {
    const { year } = params

    const groupedByYears = Object.groupBy(allProjects, 
        ({ data }: ProjectData) => data.date.getFullYear().toString())

    
    if(!year) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    const projects = groupedByYears[year]
    
    if(!projects) {
        return new Response(null, {
            status: 404,
            statusText: "Not found",
        });
    }

    return new Response(JSON.stringify({
        data: projects
    }), {
        status: 200
    })
}