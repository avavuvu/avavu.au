import rawGraphData from '$lib/wikiGraph.json'
import type { GraphData } from '$lib'

const graphData = rawGraphData as unknown as GraphData

export const sections = graphData.sections

export const staticRoutes = ['archive', 'random', 'graph', 'api', 'about', 'essays', 'newsletter']

export const sectionsWithOwnChildRoutes = ['essays', 'newsletter']

export const isCategory = (id: string) => id in graphData.categories

export const getCategoryMembers = (category: string) => graphData.categories[category] ?? []

export const getCategoryNodeIds = (category: string) => [category, ...getCategoryMembers(category)]

export const getCanonicalPath = (id: string) => graphData.paths[id] ?? `/${id}`
