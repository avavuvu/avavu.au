<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()

	const sorted = data.writing.toSorted((a, b) => {
		const dateA = new Date(a.data.metadata.date)
		const dateB = new Date(b.data.metadata.date)

		return dateB.getTime() - dateA.getTime()
	})
</script>

<Meta
	title="Ava Dinh-Vu's Essays"
/>


<Block colStart={3} depth={3}>
	{#snippet heading()}
		essays
	{/snippet}

	<ul>
		{#each sorted as writing}
			<li>
				<a href="/writing/{writing.id}" data-sveltekit-preload-data="off">
					{writing.data.metadata.title}
				</a>
			</li>
		{/each}
	</ul>
</Block>
