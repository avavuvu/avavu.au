<script lang="ts">
	import graphData from '$lib/wikiGraph.json'

	const { width, height, nodes, edges } = graphData

	const offsetNodes = nodes.map((node) => ({
		id: node.id,
		x: node.x + width / 2,
		y: node.y + height / 2
	}))

	const nodeById = new Map(offsetNodes.map((node) => [node.id, node]))
</script>

<svg viewBox="{-100} {-100} {width + 100} {height + 100}" width="100%" height="100%">
	{#each edges as [from, to]}
		{@const a = nodeById.get(from)}
		{@const b = nodeById.get(to)}
		{#if a && b}
			<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="black" stroke-width="1" />
		{/if}
	{/each}

	{#each offsetNodes as node}
		<a href="/wiki/{node.id}">
			<circle cx={node.x} cy={node.y} r="4" fill="black" />
			<text x={node.x + 6} y={node.y + 4} font-size="10">{node.id}</text>
		</a>
	{/each}
</svg>
