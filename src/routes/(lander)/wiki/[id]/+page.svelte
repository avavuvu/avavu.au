<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import { formatDate } from '$lib/utils.js'

	let { data } = $props()

	$effect(() => {
		const metadata = data.entry.data.metadata
		if (metadata.kind === 'archive' && metadata.youtubeId) {
			import('@justinribeiro/lite-youtube')
		}
	})
</script>

<Meta
	title={data.entry.data.metadata.title}
	description={data.entry.plainText}
	image={data.entry.firstImage || undefined}
/>

{#key data.entry}
	{@const metadata = data.entry.data.metadata}
	<Block colStart={1} colSpan={4} depth={3} scrollTo="top" background leftAlign={true}>
		{#snippet heading()}
			{metadata.title}
		{/snippet}
		<div class="min-h-48 pr-4">
			{#if metadata.kind === 'archive'}
				<p>
					{formatDate(new Date(metadata.date))}
				</p>

				{#if metadata.collaborators}
					<div>With:</div>
					<ul class="ml-4">
						{#each metadata.collaborators as { name, url }}
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
					<lite-youtube videoid={metadata.youtubeId}> </lite-youtube>
				{/if}
			{/if}

			<data.entry.data.default />

			{#if metadata.kind === 'archive' && metadata.link}
				<p>
					<a href={metadata.link}>
						{metadata.title}
					</a>
				</p>
			{/if}
		</div>
	</Block>
{/key}
