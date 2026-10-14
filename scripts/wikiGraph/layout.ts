import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'
import Graph from 'graphology'
import louvain from 'graphology-communities-louvain'

type Point = { x: number; y: number }
type Layout = Map<string, Point>
type Edge = [string, string]

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8]
const MARGIN = 30
const LABEL_HEIGHT = 18
const LABEL_GAP = 8
const CATEGORY_WEIGHT = 3

const GROUP_PADDING = 0.95
const GROUP_GRAVITY = 0.3
const COMMUNITY_PULL = 0.25
const INSIDE_DISTANCE = 70
const BETWEEN_DISTANCE = 100
const CHARGE = -90

const seededRandom = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const segmentsCross = (a: Point, b: Point, c: Point, d: Point) => {
	const ccw = (p: Point, q: Point, r: Point) =>
		(r.y - p.y) * (q.x - p.x) > (q.y - p.y) * (r.x - p.x)
	return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d)
}

export const countCrossings = (layout: Layout, edges: Edge[]) => {
	let crossings = 0
	for (let i = 0; i < edges.length; i++) {
		for (let j = i + 1; j < edges.length; j++) {
			const [a, b] = edges[i]
			const [c, d] = edges[j]
			if (a === c || a === d || b === c || b === d) continue
			if (segmentsCross(layout.get(a)!, layout.get(b)!, layout.get(c)!, layout.get(d)!)) {
				crossings++
			}
		}
	}
	return crossings
}

const resolveOverlaps = (layout: Layout, widthOf: (id: string) => number) => {
	const nodes = [...layout].map(([id, point]) => ({ id, ...point }))

	for (let round = 0; round < 200; round++) {
		let moved = false

		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const a = nodes[i]
				const b = nodes[j]
				const overlapX =
					(widthOf(a.id) + widthOf(b.id)) / 2 + LABEL_GAP - Math.abs(a.x - b.x)
				const overlapY = LABEL_HEIGHT + LABEL_GAP - Math.abs(a.y - b.y)
				if (overlapX <= 0 || overlapY <= 0) continue

				moved = true
				if (overlapY < overlapX) {
					const push = (overlapY / 2) * (a.y < b.y ? -1 : 1)
					a.y += push
					b.y -= push
				} else {
					const push = (overlapX / 2) * (a.x < b.x ? -1 : 1)
					a.x += push
					b.x -= push
				}
			}
		}

		if (!moved) break
	}

	return new Map(nodes.map(({ id, x, y }) => [id, { x, y }]))
}

const layoutOnce = (
	nodeIds: string[],
	edges: Edge[],
	isCategoryEdge: (edge: Edge) => boolean,
	widthOf: (id: string) => number,
	seed: number
): Layout => {
	const random = seededRandom(seed)
	const radiusOf = (id: string) => widthOf(id) / 2 + 12

	const graph = new Graph({ type: 'undirected' })
	for (const id of nodeIds) graph.addNode(id)
	for (const edge of edges) {
		const [a, b] = edge
		if (a !== b && !graph.hasEdge(a, b)) {
			graph.addEdge(a, b, { weight: isCategoryEdge(edge) ? CATEGORY_WEIGHT : 1 })
		}
	}

	const community: Record<string, number> = louvain(graph, {
		getEdgeWeight: 'weight',
		rng: random
	})
	const groupOf = (id: string) => String(community[id])

	const members = new Map<string, string[]>()
	for (const id of nodeIds) {
		if (!members.has(groupOf(id))) members.set(groupOf(id), [])
		members.get(groupOf(id))!.push(id)
	}

	const groupNodes = [...members].map(([id, ids]) => ({
		id,
		radius:
			Math.sqrt(ids.reduce((sum, member) => sum + radiusOf(member) ** 2, 0)) * GROUP_PADDING,
		x: (random() - 0.5) * 1000,
		y: (random() - 0.5) * 1000
	}))

	const groupWeights = new Map<string, number>()
	for (const [a, b] of edges) {
		const [ga, gb] = [groupOf(a), groupOf(b)].sort()
		if (ga === gb) continue
		const key = `${ga}\u0000${gb}`
		groupWeights.set(key, (groupWeights.get(key) ?? 0) + 1)
	}
	const groupLinks = [...groupWeights].map(([key, weight]) => {
		const [source, target] = key.split('\u0000')
		return { source, target, weight }
	})

	type GroupNode = (typeof groupNodes)[number]
	forceSimulation(groupNodes)
		.randomSource(random)
		.force(
			'link',
			forceLink<
				GroupNode,
				{ source: string | GroupNode; target: string | GroupNode; weight: number }
			>(groupLinks)
				.id((node) => node.id)
				.distance(
					(link) => (link.source as GroupNode).radius + (link.target as GroupNode).radius
				)
				.strength((link) => Math.min(1, link.weight / 4))
		)
		.force('collide', forceCollide<GroupNode>((node) => node.radius).iterations(4))
		.force('x', forceX<GroupNode>(0).strength(GROUP_GRAVITY))
		.force('y', forceY<GroupNode>(0).strength(GROUP_GRAVITY))
		.stop()
		.tick(600)

	const centre = new Map(groupNodes.map(({ id, x, y }) => [id, { x, y }]))

	const nodes = nodeIds.map((id) => {
		const { x, y } = centre.get(groupOf(id))!
		return { id, x: x + (random() - 0.5) * 50, y: y + (random() - 0.5) * 50 }
	})
	type Node = (typeof nodes)[number]
	const links = edges.map((edge) => ({
		source: edge[0],
		target: edge[1],
		inside: groupOf(edge[0]) === groupOf(edge[1]),
		category: isCategoryEdge(edge)
	}))
	type Link = (typeof links)[number]

	forceSimulation(nodes)
		.randomSource(random)
		.alphaDecay(0.01)
		.force('charge', forceManyBody<Node>().strength(CHARGE).distanceMax(250))
		.force(
			'link',
			forceLink<
				Node,
				Omit<Link, 'source' | 'target'> & { source: string | Node; target: string | Node }
			>(links)
				.id((node) => node.id)
				.distance((link) => (link.inside ? INSIDE_DISTANCE : BETWEEN_DISTANCE))
				.strength((link) => (link.inside ? (link.category ? 0.6 : 0.3) : 0.02))
		)
		.force(
			'x',
			forceX<Node>((node) => centre.get(groupOf(node.id))!.x).strength(COMMUNITY_PULL)
		)
		.force(
			'y',
			forceY<Node>((node) => centre.get(groupOf(node.id))!.y).strength(COMMUNITY_PULL)
		)
		.force('collide', forceCollide<Node>((node) => radiusOf(node.id)).iterations(3))
		.stop()
		.tick(1200)

	return resolveOverlaps(new Map(nodes.map(({ id, x, y }) => [id, { x, y }])), widthOf)
}

export const layoutGraph = (
	nodeIds: string[],
	edgeList: Edge[],
	widthOf: (id: string) => number,
	isCategoryEdge: (edge: Edge) => boolean
) => {
	const { layout, crossings } = SEEDS.map((seed) => {
		const layout = layoutOnce(nodeIds, edgeList, isCategoryEdge, widthOf, seed)
		return { layout, crossings: countCrossings(layout, edgeList) }
	}).sort((a, b) => a.crossings - b.crossings)[0]

	const points = [...layout.values()]
	const minX = Math.min(...points.map(({ x }) => x)) - MARGIN
	const minY = Math.min(...points.map(({ y }) => y)) - MARGIN

	const positions: Record<string, [number, number]> = {}
	for (const [id, { x, y }] of layout) {
		positions[id] = [Math.round((x - minX) * 10) / 10, Math.round((y - minY) * 10) / 10]
	}

	return { nodeIds, edgeList, positions, crossings }
}
