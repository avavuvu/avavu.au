import type { APIRoute } from "astro"
import { getCollection, getEntry } from "astro:content"
import { allProjects } from "../../../lib/projectCollection"

export type SortKey = 'year' | 'rating' | 'type';

export const getStaticPaths = (() => {
    return [
        { params: { sort: "year" }},
        { params: { sort: "rating" }},
        { params: { sort: "type" }},
    ];
}) 

export const GET: APIRoute = async ({ params, request }) => {
    const { sort } = params

    const projectMetadata = allProjects.map(({data, collection}) => {
        let metadata = {
            title: data.title,
            collection, 
            date: data.date
        }

        switch(sort as SortKey) {
            case "year": return { ...metadata, year: data.date.getFullYear() }
            case "rating": return { ...metadata, rating: data.rating ? '★'.repeat(data.rating) : 'other', }
            default: return metadata
        }
    })

    const projects = Object.groupBy(projectMetadata, (project) => {
        if("year" in project) {
            return project.year
        }else if("rating" in project) {
            return project.rating
        }else {
            return project.collection
        }
    })

    if (!projects) {
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