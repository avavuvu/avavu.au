<script lang="ts">
	import { onMount, type Snippet } from 'svelte'
	import { fade } from 'svelte/transition'
	import Heading from '../Heading.svelte'
	import { globalState } from '$lib/lander.svelte'
	import { MediaQuery } from 'svelte/reactivity'
	import { page } from '$app/state'
	import { afterNavigate } from '$app/navigation'

	const isLarge = new MediaQuery('min-width: 640px')
	let block: HTMLElement = $state(undefined!)

	const {
		children,
		heading,
		depth,
		colStart,
		colSpan = 2,
		scrollTo = 'bottom',
		background = false,
		leftAlign = false
	} = $props<{
		children: Snippet
		heading: Snippet
		depth: number
		colStart: number
		colSpan?: number
		scrollTo?: 'top' | 'bottom'
		background?: boolean
		leftAlign?: boolean
	}>()

	let level = $derived(globalState.depth - depth + 1)

	let opacity = $derived(level === 1 ? 100 : Math.max(100 - level * 24, 20))

	afterNavigate(() => {
		if (!isLarge.current && level === 1) {
			//is mobile
			page.url.pathname
			block.scrollIntoView({ block: scrollTo === 'top' ? 'start' : 'end' })
		}
	})
</script>

<div
	class:needs-background={background}
	style:text-align={leftAlign ? "left" : "right"}
	style:opacity="{isLarge.current ? '100' : opacity}%"
	style:grid-column-start={colStart}
	style:grid-column-end={colStart + colSpan}
	class="content min-h-0 overflow-y-scroll transition-opacity duration-1000 md:max-h-full"
	bind:this={block}
	in:fade
>
	<Heading {level}>
		{@render heading()}
	</Heading>

	{@render children()}
</div>

<style>
	.content {
		grid-row-start: 1;
		grid-row-end: 2;
	}
</style>
