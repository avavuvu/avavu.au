export type Point = { x: number; y: number }

export type GraphLayout = {
	positions: Map<string, Point>
	edges: Array<[string, string]>
}

type LayoutOptions = {
	width: number
	height: number
	iterations?: number
}

const length = (v: Point) => Math.sqrt(v.x * v.x + v.y * v.y) || 0.0001

export const layoutGraph = (
	edges: Map<string, Set<string>>,
	{ width, height, iterations = 300 }: LayoutOptions
): GraphLayout => {
	const nodeIds = new Set<string>()
	const edgeList: Array<[string, string]> = []

	for (const [from, targets] of edges) {
		nodeIds.add(from)
		for (const to of targets) {
			if (to === from) continue
			nodeIds.add(to)
			edgeList.push([from, to])
		}
	}

	const pos = new Map<string, Point>()
	const disp = new Map<string, Point>()

	for (const id of nodeIds) {
		pos.set(id, {
			x: (Math.random() - 0.5) * width,
			y: (Math.random() - 0.5) * height
		})
	}

	if (nodeIds.size === 0) {
		return { positions: pos, edges: edgeList }
	}

	const area = width * height
	const k = Math.sqrt(area / nodeIds.size)

	const fa = (x: number) => (x * x) / k
	const fr = (x: number) => (k * k) / x

	let t = width / 10
	const coolingStep = t / iterations

	for (let i = 0; i < iterations; i++) {
		for (const v of nodeIds) {
			disp.set(v, { x: 0, y: 0 })
		}

		for (const v of nodeIds) {
			const vPos = pos.get(v)!

			for (const u of nodeIds) {
				if (u === v) continue

				const uPos = pos.get(u)!
				const delta = { x: vPos.x - uPos.x, y: vPos.y - uPos.y }
				const dist = length(delta)
				const force = fr(dist)
				const vDisp = disp.get(v)!

				disp.set(v, {
					x: vDisp.x + (delta.x / dist) * force,
					y: vDisp.y + (delta.y / dist) * force
				})
			}
		}

		for (const [from, to] of edgeList) {
			const vPos = pos.get(from)!
			const uPos = pos.get(to)!
			const delta = { x: vPos.x - uPos.x, y: vPos.y - uPos.y }
			const dist = length(delta)
			const force = fa(dist)

			const vDisp = disp.get(from)!
			disp.set(from, {
				x: vDisp.x - (delta.x / dist) * force,
				y: vDisp.y - (delta.y / dist) * force
			})

			const uDisp = disp.get(to)!
			disp.set(to, {
				x: uDisp.x + (delta.x / dist) * force,
				y: uDisp.y + (delta.y / dist) * force
			})
		}

		for (const v of nodeIds) {
			const vDisp = disp.get(v)!
			const dispLen = length(vDisp)
			const vPos = pos.get(v)!
			const clamped = Math.min(dispLen, t)

			pos.set(v, {
				x: Math.min(width / 2, Math.max(-width / 2, vPos.x + (vDisp.x / dispLen) * clamped)),
				y: Math.min(height / 2, Math.max(-height / 2, vPos.y + (vDisp.y / dispLen) * clamped))
			})
		}

		t -= coolingStep
	}

	return { positions: pos, edges: edgeList }
}
