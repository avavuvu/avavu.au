<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade } from 'svelte/transition'
	import Heading from '../Heading.svelte'
	import { globalState } from '$lib/lander.svelte'

	const { children, heading, depth, colStart, colSpan = 2, } = $props<{
		children: Snippet,
		heading: Snippet,
		depth: number
		colStart: number,
		colSpan?: number
	}>()

	let level = $derived(
		globalState.depth - depth + 1
	)
</script>

<div style:grid-column-start={colStart} style:grid-column-end="{colStart + colSpan}" class="content" in:fade>
	<Heading {level}>
		{@render heading()}
	</Heading>

	{@render children()}
</div>

<style>
	div {
		grid-row-start: 1;
		grid-row-end: 2;
	}
</style>
