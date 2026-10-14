import rawGraphData from '$lib/wikiGraph.json'
import type { GraphData } from '$lib'
import { labelWidth } from '$lib/graphLabel'

export { LABEL_HEIGHT } from '$lib/graphLabel'

export type Point = { x: number; y: number }

export type GraphNode = Point & {
	id: string
	label: string
	href: string
	width: number
}

export type GraphEdge = { from: GraphNode; to: GraphNode }

const graph = rawGraphData as unknown as GraphData

const BOUNDS_MARGIN = 30

export const nodes: GraphNode[] = graph.nodeIds.map((id) => {
	const [x, y] = graph.positions[id]
	const label = graph.titles[id] ?? id
	return {
		id,
		x,
		y,
		label,
		href: graph.paths[id] ?? `/${id}`,
		width: labelWidth(label)
	}
})

export const nodeById = new Map(nodes.map((node) => [node.id, node]))

export const edges: GraphEdge[] = graph.edgeList.flatMap(([from, to]) => {
	const a = nodeById.get(from)
	const b = nodeById.get(to)
	return a && b ? [{ from: a, to: b }] : []
})

const neighbours = new Map<string, Set<string>>()
for (const { from, to } of edges) {
	if (!neighbours.has(from.id)) neighbours.set(from.id, new Set())
	if (!neighbours.has(to.id)) neighbours.set(to.id, new Set())
	neighbours.get(from.id)!.add(to.id)
	neighbours.get(to.id)!.add(from.id)
}

export const withNeighbours = (id: string) => new Set([id, ...(neighbours.get(id) ?? [])])

const xs = nodes.map(({ x }) => x)
const ys = nodes.map(({ y }) => y)

export const bounds = {
	minX: Math.min(...xs) - BOUNDS_MARGIN,
	maxX: Math.max(...xs) + BOUNDS_MARGIN,
	minY: Math.min(...ys) - BOUNDS_MARGIN,
	maxY: Math.max(...ys) + BOUNDS_MARGIN
}

export const graphCenter: Point = {
	x: (bounds.minX + bounds.maxX) / 2,
	y: (bounds.minY + bounds.maxY) / 2
}
