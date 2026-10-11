<script lang="ts">
	import rawGraphData from '$lib/wikiGraph.json'
	import type { GraphData } from '$lib'

	type Point = { x: number; y: number }
	import { select } from 'd3-selection'
	import 'd3-transition'
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
	import { onMount } from 'svelte'

	const graphData = rawGraphData as unknown as GraphData
	const paths = graphData.paths

	const layout = {
		nodeIds: graphData.nodeIds,
		edgeList: graphData.edgeList,
		positions: new Map<string, Point>(
			Object.entries(graphData.positions).map(([id, [x, y]]) => [id, { x, y }])
		)
	}

	const {
		current = null,
		highlighted = null,
		interactive = true
	}: {
		current?: string | null
		highlighted?: string[] | null
		interactive?: boolean
	} = $props()

	const DEFAULT_WIDTH = 800
	const DEFAULT_HEIGHT = 500
	const RESIZE_DEBOUNCE_MS = 200

	let rawWidth = $state(0)
	let rawHeight = $state(0)

	let width = $state(DEFAULT_WIDTH)
	let height = $state(DEFAULT_HEIGHT)

	let ready = $state(false)

	let resizeTimer: ReturnType<typeof setTimeout>

	$effect(() => {
		const w = rawWidth
		const h = rawHeight
		if (!w || !h) return

		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(() => {
			width = w
			height = h
			ready = true
		}, RESIZE_DEBOUNCE_MS)

		return () => clearTimeout(resizeTimer)
	})

	let hovered: string | null = $state(null)

	const currentExists = $derived(current !== null && layout.positions.has(current))
	const active = $derived(hovered ?? (currentExists ? current : null))

	const isNeighbor = (id: string) =>
		layout.edgeList.some(
			([from, to]) => (from === active && to === id) || (to === active && from === id)
		)

	const isDimmed = (id: string) => {
		if (interactive) return hovered !== null && hovered !== id && !isNeighbor(id)
		if (highlighted) return !highlighted.includes(id)
		return active !== null && active !== id && !isNeighbor(id)
	}

	const READABLE_ZOOM = 1.2
	const BOUNDS_MARGIN = 30

	const points = [...layout.positions.values()]
	const bounds = {
		minX: Math.min(...points.map((p) => p.x)) - BOUNDS_MARGIN,
		maxX: Math.max(...points.map((p) => p.x)) + BOUNDS_MARGIN,
		minY: Math.min(...points.map((p) => p.y)) - BOUNDS_MARGIN,
		maxY: Math.max(...points.map((p) => p.y)) + BOUNDS_MARGIN
	}
	const graphCenter: Point = {
		x: (bounds.minX + bounds.maxX) / 2,
		y: (bounds.minY + bounds.maxY) / 2
	}

	type Camera = { k: number; x: number; y: number }

	const target = $derived.by((): Camera => {
		const fullGraphZoom = Math.min(
			width / (bounds.maxX - bounds.minX),
			height / (bounds.maxY - bounds.minY)
		)
		const k = Math.max(READABLE_ZOOM, fullGraphZoom)
		const focus = (currentExists && current && layout.positions.get(current)) || graphCenter

		return { k, x: width / 2 - k * focus.x, y: height / 2 - k * focus.y }
	})

	const CAMERA_DURATION_MS = 700

	let svgEl: SVGSVGElement
	let camera = $state<Camera | null>(null)
	let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null = null
	let placed = false
	let lastTarget: Camera | null = null

	const shown = $derived(camera ?? target)
	const cameraTransform = $derived(`translate(${shown.x} ${shown.y}) scale(${shown.k})`)

	const toZoom = ({ k, x, y }: Camera) => zoomIdentity.translate(x, y).scale(k)

	const sameCamera = (a: Camera, b: Camera) =>
		Math.abs(a.k - b.k) < 1e-6 && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5

	onMount(() => {
		const behavior = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.05, 20])
			.clickDistance(4)
			.filter(
				(event) =>
					interactive && (!event.ctrlKey || event.type === 'wheel') && !event.button
			)
			.on('zoom', ({ transform }) => {
				camera = { k: transform.k, x: transform.x, y: transform.y }
			})

		const selection = select(svgEl)
		selection.call(behavior)
		zoomBehavior = behavior

		return () => {
			selection.interrupt().on('.zoom', null)
			zoomBehavior = null
		}
	})

	$effect(() => {
		const next = target
		if (!zoomBehavior || !ready) return
		if (lastTarget && sameCamera(lastTarget, next)) return
		lastTarget = next

		const selection = select(svgEl)

		if (!placed) {
			placed = true
			selection.call(zoomBehavior.transform, toZoom(next))
			return
		}

		selection
			.transition()
			.duration(CAMERA_DURATION_MS)
			.call(zoomBehavior.transform, toZoom(next))
	})

	const FONT_SIZE = 10
	const labelOf = (id: string) => graphData.titles[id] ?? id
	const labelWidth = (id: string) => labelOf(id).length * 5.6 + 10
	const labelHeight = FONT_SIZE + 8
</script>

<div class="graph" bind:clientWidth={rawWidth} bind:clientHeight={rawHeight}>
	<svg
		bind:this={svgEl}
		viewBox="0 0 {width} {height}"
		width="100%"
		height="100%"
		role="img"
		aria-label="Graph of linked wiki pages"
		class:ready
		class:interactive
	>
		<g transform={cameraTransform}>
			{#each layout.edgeList as [from, to]}
				{@const a = layout.positions.get(from)}
				{@const b = layout.positions.get(to)}
				{#if a && b}
					<path
						d="M {a.x} {a.y} L {b.x} {b.y}"
						stroke="currentColor"
						stroke-width="1"
						fill="none"
						opacity={isDimmed(from) || isDimmed(to) ? 0.1 : 0.35}
					/>
				{/if}
			{/each}

			{#each layout.nodeIds as id}
				{@const node = layout.positions.get(id)}
				{@const isCurrent = id === current}
				{@const w = labelWidth(id)}
				{#if node}
					<a
						href={paths[id] ?? `/${id}`}

						tabindex={interactive ? 0 : -1}
						onpointerenter={() => (hovered = id)}
						onpointerleave={() => (hovered = null)}
						class:dimmed={isDimmed(id)}
					>
						<rect
							x={node.x - w / 2}
							y={node.y - labelHeight / 2}
							width={w}
							height={labelHeight}
							fill="white"
							stroke="currentColor"
							stroke-width={isCurrent ? 2 : 1}
						/>
						<text
							x={node.x}
							y={node.y}
							text-anchor="middle"
							dominant-baseline="middle"
							font-size={FONT_SIZE}
							font-weight={isCurrent ? 'bold' : 'normal'}
							fill="currentColor"
						>
							{labelOf(id)}
						</text>
					</a>
				{/if}
			{/each}
		</g>
	</svg>
</div>

<style>
	.graph {
		width: 100%;
		height: 100%;
	}

	svg {
		display: block;
		opacity: 0;
		pointer-events: none;

		&.ready {
			opacity: 1;
		}

		&.ready.interactive {
			pointer-events: auto;
			cursor: grab;
			touch-action: none;
		}
	}

	.dimmed {
		opacity: 0.25;
	}
</style>
