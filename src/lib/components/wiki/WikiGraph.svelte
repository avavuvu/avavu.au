<script lang="ts">
	import { select } from 'd3-selection'
	import 'd3-transition'
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
	import type { Attachment } from 'svelte/attachments'
	import {
		LINE_HEIGHT,
		bounds,
		edges,
		graphCenter,
		nodeById,
		nodes,
		withNeighbours
	} from '$lib/graphModel'

	const {
		current = null,
		highlighted = null,
		interactive = true
	}: {
		current?: string | null
		highlighted?: string[] | null
		interactive?: boolean
	} = $props()

	const READABLE_ZOOM = 1.2
	const MOBILE_ZOOM = 0.8
	const MOBILE_MAX_WIDTH = 640
	const CAMERA_DURATION_MS = 700

	let width = $state(0)
	let height = $state(0)
	let hovered = $state<string | null>(null)
	let transform = $state('')

	const ready = $derived(width > 0 && height > 0)
	const currentNode = $derived(current ? nodeById.get(current) : undefined)

	const visible = $derived.by((): Set<string> | null => {
		if (interactive) return hovered ? withNeighbours(hovered) : null
		if (highlighted) return new Set(highlighted)
		const active = hovered ?? currentNode?.id
		return active ? withNeighbours(active) : null
	})

	const isDimmed = (id: string) => visible !== null && !visible.has(id)

	const target = $derived.by(() => {
		const fullGraphZoom = Math.min(
			width / (bounds.maxX - bounds.minX),
			height / (bounds.maxY - bounds.minY)
		)
		const baseZoom = width < MOBILE_MAX_WIDTH ? MOBILE_ZOOM : READABLE_ZOOM
		const k = Math.max(baseZoom, fullGraphZoom)
		const focus = currentNode ?? graphCenter
		return zoomIdentity.translate(width / 2 - k * focus.x, height / 2 - k * focus.y).scale(k)
	})

	let camera = $state.raw<{
		svg: SVGSVGElement
		behavior: ZoomBehavior<SVGSVGElement, unknown>
	}>()

	const attachCamera: Attachment<SVGSVGElement> = (svg) => {
		const behavior = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.05, 20])
			.clickDistance(4)
			.filter(
				(event) =>
					interactive && (!event.ctrlKey || event.type === 'wheel') && !event.button
			)
			.on('zoom', (event) => (transform = event.transform.toString()))

		select(svg).call(behavior)
		camera = { svg, behavior }

		return () => {
			select(svg).interrupt().on('.zoom', null)
			camera = undefined
		}
	}

	let placed = false
	let lastFocus: string | undefined

	$effect(() => {
		const next = target
		const focus = currentNode?.id
		if (!camera || !ready) return

		const selection = select(camera.svg)
		const animate = placed && focus !== lastFocus
		placed = true
		lastFocus = focus

		if (animate) {
			selection
				.transition()
				.duration(CAMERA_DURATION_MS)
				.call(camera.behavior.transform, next)
		} else {
			selection.interrupt().call(camera.behavior.transform, next)
		}
	})
</script>

<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
	<svg
		{@attach attachCamera}
		width="100%"
		height="100%"
		role="group"
		aria-label="Graph of linked wiki pages"
		class:ready
		class:interactive
	>
		<g {transform}>
			{#each edges as { from, to }}
				<path
					class="edge"
					class:dimmed={isDimmed(from.id) || isDimmed(to.id)}
					d="M {from.x} {from.y} L {to.x} {to.y}"
				/>
			{/each}

			{#each nodes as node (node.id)}
				<a
					href={node.href}
					tabindex={interactive ? 0 : -1}
					aria-label={node.label}
					class:current={node.id === current}
					class:dimmed={isDimmed(node.id)}
					onpointerenter={() => (hovered = node.id)}
					onpointerleave={() => (hovered = null)}
				>
					<rect
						x={node.x - node.width / 2}
						y={node.y - node.height / 2}
						width={node.width}
						height={node.height}
					/>
					<text>
						{#each node.lines as line, index}
							<tspan
								x={node.x}
								y={node.y + (index - (node.lines.length - 1) / 2) * LINE_HEIGHT}
								>{line}</tspan
							>
						{/each}
					</text>
				</a>
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

	.edge {
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
		opacity: 0.35;

		&.dimmed {
			opacity: 0.1;
		}
	}

	rect {
		fill: white;
		stroke: currentColor;
		stroke-width: 1;
	}

	text {
		fill: currentColor;
		font-size: 10px;
		text-anchor: middle;
		dominant-baseline: middle;
	}

	a {
		color: blue;
	}

	a:visited {
		color: rebeccapurple;
	}

	a.dimmed {
		opacity: 0.25;
	}

	.current {
		rect {
			stroke-width: 2;
		}

		text {
			font-weight: bold;
		}
	}
</style>
