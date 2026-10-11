import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'

type SimNode = {
	id: string
	x: number
	y: number
	vx?: number
	vy?: number
}

type SimLink = {
	source: string | SimNode
	target: string | SimNode
}

const REFERENCE_CELL = 130
const MARGIN = 30
const GRAVITY = 0.015
const GRAVITY_UNLINKED = 0.05

const resolveOverlaps = (nodes: SimNode[], radiusOf: (id: string) => number, rounds: number) => {
	for (let round = 0; round < rounds; round++) {
		let moved = false

		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const a = nodes[i]
				const b = nodes[j]
				const minSeparation = radiusOf(a.id) + radiusOf(b.id)

				let dx = a.x - b.x
				let dy = a.y - b.y
				let dist = Math.sqrt(dx * dx + dy * dy)
				if (dist >= minSeparation) continue

				moved = true

				if (dist < 1e-6) {
					const angle = i * 2.399963 + j
					dx = Math.cos(angle)
					dy = Math.sin(angle)
					dist = 1
				}

				const push = (minSeparation - dist) / 2 / dist
				a.x += dx * push
				a.y += dy * push
				b.x -= dx * push
				b.y -= dy * push
			}
		}

		if (!moved) break
	}
}

export const layoutGraph = (
	nodeIds: string[],
	edgeList: Array<[string, string]>,
	labelOf: (id: string) => string
) => {
	const degree = new Map<string, number>()
	for (const id of nodeIds) degree.set(id, 0)
	for (const [from, to] of edgeList) {
		degree.set(from, (degree.get(from) ?? 0) + 1)
		degree.set(to, (degree.get(to) ?? 0) + 1)
	}

	const startRadius = Math.sqrt((nodeIds.length * REFERENCE_CELL * REFERENCE_CELL) / Math.PI)

	const simNodes: SimNode[] = nodeIds.map((id, i) => {
		const angle = (i / nodeIds.length) * Math.PI * 2
		return { id, x: Math.cos(angle) * startRadius, y: Math.sin(angle) * startRadius }
	})

	const simLinks: SimLink[] = edgeList.map(([source, target]) => ({ source, target }))

	const collideRadius = (id: string) =>
		17 + labelOf(id).length * 4.1 + (degree.get(id) ?? 0) * 1.8
	const gravity = (node: SimNode) => ((degree.get(node.id) ?? 0) > 0 ? GRAVITY : GRAVITY_UNLINKED)

	const simulation = forceSimulation(simNodes)
		.force('charge', forceManyBody().strength(-260))
		.force(
			'link',
			forceLink<SimNode, SimLink>(simLinks)
				.id((node) => node.id)
				.distance(110)
				.strength(0.3)
		)
		.force('x', forceX<SimNode>(0).strength(gravity))
		.force('y', forceY<SimNode>(0).strength(gravity))
		.force('collide', forceCollide<SimNode>((node) => collideRadius(node.id)).iterations(5))
		.stop()

	for (let i = 0; i < 400; i++) simulation.tick()

	resolveOverlaps(simNodes, collideRadius, 120)

	const minX = Math.min(...simNodes.map((node) => node.x)) - MARGIN
	const minY = Math.min(...simNodes.map((node) => node.y)) - MARGIN

	const positions: Record<string, [number, number]> = {}
	for (const node of simNodes) {
		positions[node.id] = [
			Math.round((node.x - minX) * 10) / 10,
			Math.round((node.y - minY) * 10) / 10
		]
	}

	return { nodeIds, edgeList, positions }
}
