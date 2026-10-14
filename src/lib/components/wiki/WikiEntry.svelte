<script lang="ts">
	import { onMount, type Component, type Snippet } from 'svelte'
	import EntryHeader from '$lib/components/EntryHeader.svelte'
	import SeeAlso from '$lib/components/SeeAlso.svelte'
	import type { Entry, Member } from '$lib'
	import { youtubeIdFrom } from '$lib/utils'

	const {
		metadata,
		component,
		members = [],
		categories = [],
		backlinks = [],
		children
	}: {
		metadata: Entry
		component: Component
		members?: Member[]
		categories?: Member[]
		backlinks?: Member[]
		children?: Snippet
	} = $props()

	const youtubeId = $derived(metadata.type ? youtubeIdFrom(metadata.url) : undefined)

	$effect(() => {
		if (youtubeId) import('@justinribeiro/lite-youtube')
	})

	const Content = $derived(component)
	const minimal = $derived(metadata.layout === 'minimal')

	type Panel = 'members' | 'backlinks'

	const open = $state({ members: false, backlinks: false })

	const storageKey = (panel: Panel) => `open:${panel}`

	const remember = (panel: Panel) => (event: Event) => {
		open[panel] = (event.currentTarget as HTMLDetailsElement).open
		localStorage.setItem(storageKey(panel), String(open[panel]))
	}

	const membersAlwaysOpen = $derived(metadata.section === true)
	const showMembers = $derived(!minimal && members.length > 0)
	const showBacklinks = $derived(!minimal && backlinks.length > 0)

	onMount(() => {
		open.members = localStorage.getItem(storageKey('members')) === 'true'
		open.backlinks = localStorage.getItem(storageKey('backlinks')) === 'true'
	})
</script>

<article>
	<EntryHeader
		title={metadata.title}
		date={metadata.section ? undefined : metadata.date}
		{categories}
	/>

	{#if metadata.type && !metadata.section}
		{#if metadata.collaborators}
			<p>
				With:
				{#each metadata.collaborators as { name, url }, i}
					{#if i > 0},
					{/if}
					{#if url}
						<a href={url}>{name}</a>
					{:else}
						{name}
					{/if}
				{/each}
			</p>
		{/if}

		{#if youtubeId}
			<lite-youtube videoid={youtubeId}></lite-youtube>
		{/if}
	{/if}

	<Content />

	{@render children?.()}

	{#if metadata.url}
		<p><a href={metadata.url}>{metadata.title}</a></p>
	{/if}

	<SeeAlso links={metadata.links} />

	{#if showMembers || showBacklinks}
		<div class="panels">
			{#if showMembers}
				<details
					open={membersAlwaysOpen || open.members}
					ontoggle={membersAlwaysOpen ? undefined : remember('members')}
				>
					<summary>Pages tagged as {metadata.title}</summary>
					<ul>
						{#each members as { href, title }}
							<li><a {href}>{title}</a></li>
						{/each}
					</ul>
				</details>
			{/if}

			{#if showBacklinks}
				<details open={open.backlinks} ontoggle={remember('backlinks')}>
					<summary>Pages that link here</summary>
					<ul>
						{#each backlinks as { href, title }}
							<li><a {href}>{title}</a></li>
						{/each}
					</ul>
				</details>
			{/if}
		</div>
	{/if}
</article>

<style>
	.panels {
		clear: both;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0 2em;
		align-items: start;
	}

	summary {
		cursor: pointer;
	}
</style>
