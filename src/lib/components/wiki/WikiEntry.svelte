<script lang="ts">
	import { onMount, type Component, type Snippet } from 'svelte'
	import { formatDate } from '$lib/utils'
	import type { Member, WikiMeta } from '$lib'

	const {
		metadata,
		component,
		members = [],
		categories = [],
		backlinks = [],
		children
	}: {
		metadata: WikiMeta
		component: Component
		members?: Member[]
		categories?: Member[]
		backlinks?: Member[]
		children?: Snippet
	} = $props()

	$effect(() => {
		if (metadata.kind === 'archive' && metadata.youtubeId) {
			import('@justinribeiro/lite-youtube')
		}
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
	<hgroup>
		<h1>{metadata.title}</h1>
		{#if metadata.kind === 'archive'}
			<p>{formatDate(new Date(metadata.date))}</p>
		{/if}
	</hgroup>
	{#if categories.length > 0}
		<ul class="categories">
			{#each categories as { href, title }}
				<li><a {href}>{title}</a></li>
			{/each}
		</ul>
	{/if}

	{#if metadata.kind === 'archive' && !metadata.section}
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

		{#if metadata.youtubeId}
			<lite-youtube videoid={metadata.youtubeId}></lite-youtube>
		{/if}
	{/if}

	<Content />

	{@render children?.()}

	{#if metadata.kind === 'archive' && metadata.link}
		<p><a href={metadata.link}>{metadata.title}</a></p>
	{/if}

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
	article > hgroup {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		/*margin-bottom: 1em;*/

		h1,
		p {
			margin: 0;
		}
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		margin: 0;
		padding: 0;
		font-style: italic;
	}

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
