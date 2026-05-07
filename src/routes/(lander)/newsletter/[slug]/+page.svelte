<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import type { Component } from 'svelte'
	import { fade } from 'svelte/transition'

	let {
		data
	} = $props()
</script>

<Meta
	title={data.metadata.title}
	description={data.metadata.preheader}
	image={data.image || undefined}
/>

<Block colStart={1} colSpan={4} depth={3}>
	{#snippet heading()}
		{data.metadata.title}
	{/snippet}
	<div class="mx-6 overflow-y-scroll px-2 lg:mx-20" in:fade>
	
		<data.content></data.content>
	</div>
</Block>
