import { getCollection, type CollectionKey } from "astro:content"
import { projectCollections } from "../projects.config"
import type { ProjectCollectionData, ProjectData } from "./types"

const data = await Promise.all(
    Object.keys(projectCollections).flatMap(name => getCollection(name as CollectionKey))
)

export const allProjects: ProjectData[] = data
    .flat()
    .map(project => ({
        ...project,
        data: project.data as ProjectCollectionData
    }))
    .toSorted(({data: dataA}, {data: dataB}) => {
        return dataA.date.getTime() - dataB.date.getTime()})