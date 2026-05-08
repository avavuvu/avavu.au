<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public'
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import { formatDate } from '$lib/utils.js';

	let {
		data
	} = $props()

	$effect(() => {
		if (data.entry?.data.metadata.youtubeId) {
			import('@justinribeiro/lite-youtube')
		}
	})
</script>

{#if data.view === "entry"}
	<Meta
		title={data.entry.data.metadata.title}
		description={data.entry.plainText}
		image={data.entry.firstImage || undefined}
			/>
{:else if data.view === "group"}
	<Meta
		title={data.subcategory === "rating-5" 
		? "★★★★★ Archive" 
		: `${data.subcategory[0].toUpperCase()}${data.subcategory.slice(1)} Archive`}
		/>
{:else}
	<Meta
		title="Archive"
		/>
{/if}
<svelte:head>
	{#if data.view === "entry"}
		{@const metadata = data.entry.data.metadata}
		{@const canonical = `${PUBLIC_SITE_URL}/archive/type/${metadata.type}/${data.entry.id}`}

		<link rel="canonical" href="{canonical}" />
		<meta property="og:url" content={canonical} />

		<title>
			{metadata.title}
		</title>
	{/if}
</svelte:head>

{#if data.groupedWorks}
{#key data.sort}
	<Block colStart={5} colSpan={1} depth={3}>
		{#snippet heading()}
			{data.sort}
		{/snippet}
		<ul>
			{#each Object.entries(data.groupedWorks).sort().reverse() as [group, work]}
				<li>
					<a href="/archive/{data.sort}/{group}">
						{#if group === "rating-5"}
						★★★★★
						{:else}
						{group}
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</Block>
	{/key}
{/if}

{#if data.subcategory}
	{#key data.subcategory}
	<Block colStart={4} colSpan={1} depth={4}>
		{#snippet heading()}
			{#if data.subcategory === "rating-5"}
				★★★★★
			{:else}
				{data.subcategory}
			{/if}
		{/snippet}

		<ul>
			{#each data.works.sort((a,b) => b.data.metadata.date.localeCompare(a.data.metadata.date)) as work}
				<li class="flex gap-1">
					<span class="inline sm:hidden lg:inline w-3">
						{{
							"interactive": "☺",
							'misc': "⌾",
							'ephemera': "★",
							'music': "♫",
							'video':  "▸"
						}[work.data.metadata.type]}
					</span>

					<a href="/archive/{data.sort}/{data.subcategory}/{work.id}">
						{work.data.metadata.title}
					</a>
				</li>
			{/each}
		</ul>
	</Block>
	{/key}
{/if}


{#if data.entry}
	{@const date = new Date(data.entry.data.metadata.date)}
	{@const metadata = data.entry.data.metadata}
	{#key data.entry}
	<Block colStart={1} colSpan={3} depth={5}>
		{#snippet heading()}
			{metadata.title}
		{/snippet}
		<div class=" pr-4 min-h-48">
			<p>
				{formatDate(date)}
			</p>

			{#if metadata.collaborators}
				<div>
					With:
				</div>
				<ul class="ml-4">
					{#each metadata.collaborators as { name, url}}
						<li>
							{#if url}
								<a href={url}>{name}</a>
							{:else}
								<span>
									{name}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
	
			{#if metadata.youtubeId}
				<lite-youtube videoid={metadata.youtubeId}>
				</lite-youtube>
			{/if}
	
			<data.entry.data.default/>

			{#if metadata.link}
				<p>
					<a href={metadata.link}>
						{metadata.title}
					</a>
				</p>
			{/if}

		</div>
	</Block>
	{/key}
{/if}