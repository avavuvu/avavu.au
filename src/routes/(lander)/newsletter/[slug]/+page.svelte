<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import type { Component } from 'svelte'
	import { fade } from 'svelte/transition'

	let { data } = $props()

	const metadata = $derived(data.metadata)
</script>

<Meta
	title={data.metadata.title}
	description={data.metadata.preheader}
	image={data.image || undefined}
/>

<Block colStart={1} colSpan={4} depth={3} scrollTo="top">
	{#snippet heading()}
		{data.metadata.title}
	{/snippet}
	<p class="italic">
		{metadata.preheader}
	</p>

	<div class="mx-6 mb-24 border bg-white px-2 pt-4 text-left lg:mx-10" in:fade>
		<data.content></data.content>

		{#if metadata.cool}
			<hr />
			<h2>Some More Things</h2>
			{#each metadata.cool as cool}
				<h3>
					<a href={cool.links[0]}>
						{cool.title}
					</a>
				</h3>
				<p>
					{cool.info}
				</p>
			{/each}
			<hr />
		{/if}

		{#if metadata.music}
			<h2>Music</h2>
			{#each metadata.music as music}
				<h3>
					<a href={music.link}>
						{music.title}
					</a>
				</h3>
				<p>
					{music.info}
				</p>
			{/each}

			<hr />
		{/if}

		{#if metadata.crosswords}
			<h2>Crosswords</h2>
			{#each metadata.crosswords as crossword}
				<h3>
					<a href={crossword.link}>
						{new Date(crossword.date).toLocaleString('en-AU', {
							day: 'numeric',
							month: 'long'
						})}
					</a>
					for <b>{crossword.vendor}</b>
				</h3>
				<p>
					{crossword.info}
				</p>
			{/each}
		{/if}
	</div>
</Block>
