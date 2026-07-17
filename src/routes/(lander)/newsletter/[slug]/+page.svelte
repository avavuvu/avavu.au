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

<Block colStart={1} colSpan={4} depth={3} scrollTo="top" background>
	{#snippet heading()}
		{data.metadata.title}
	{/snippet}
	<p class="italic">
		{metadata.preheader}
	</p>

	<div in:fade class="text-left">
		{#if data.content}
			<data.content />
		{:else if data.html}
			<span class="my-4 inline-flex items-center justify-center gap-1">
				<span class="h-2 w-2 rounded-full bg-[#92ca3a]"></span>
				<a class=" block italic" href="https://ava.room.lc/{data.slug}"
					>This newsletter is better read on Showroom</a
				>
			</span>

			{@html data.html}
		{/if}

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
