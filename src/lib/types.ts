import type { DataEntryMap, InferEntrySchema } from "astro:content"

export type Project = InferEntrySchema<keyof DataEntryMap>

export type Collection = (keyof DataEntryMap) | "" 

export type ProjectData = {
    data: Project,
    id: string,
    collection: Collection
}

export type ProjectSort = ((a: [string, ProjectData[]], b: [string, ProjectData[]]) => number) | undefined