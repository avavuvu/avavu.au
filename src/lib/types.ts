import type { CollectionEntry, CollectionKey, DataEntryMap, InferEntrySchema } from "astro:content"

export type Project = InferEntrySchema<keyof DataEntryMap>

export type Collection = (keyof DataEntryMap) | "" 

export type ProjectData = {
    data: ProjectCollectionData,
    id: string,
    collection: Collection
}

export type ProjectMetadata = {
    title: string,
    collection: CollectionKey,
    date: string
} & ( {
    rating: string
} | {
    year: string
})

export type ProjectSort = ((a: [string, ProjectData[]], b: [string, ProjectData[]]) => number)

export type ProjectCollectionData = CollectionEntry<"ephemera">["data"] 
    | CollectionEntry<"interactive">["data"]
    | CollectionEntry<"misc">["data"]
    | CollectionEntry<"music">["data"]
    | CollectionEntry<"video">["data"]