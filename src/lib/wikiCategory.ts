import rawGraphData from '$lib/wikiGraph.json'
import type { GraphData } from '$lib'

const graphData = rawGraphData as unknown as GraphData

export const sections = graphData.sections

export const staticRoutes = ['archive', 'random', 'graph', 'api', 'about', 'newsletter']

export const sectionsWithOwnChildRoutes = ['newsletter']

export const isCategory = (id: string) => id in graphData.categories

export const getCategoryMembers = (category: string) => graphData.categories[category] ?? []

export const getCategoryNodeIds = (category: string) => [category, ...getCategoryMembers(category)]

export const getCategoriesOf = (id: string) => graphData.pageCategories[id] ?? []

export const getCanonicalPath = (id: string) => graphData.paths[id] ?? `/${id}`

const idByPath = new Map<string, string>()
for (const id of graphData.nodeIds) idByPath.set(`/${id}`, id)
for (const [id, path] of Object.entries(graphData.paths)) idByPath.set(path, id)

export const getIdForPath = (path: string) => idByPath.get(path.replace(/\/$/, '') || '/') ?? null
