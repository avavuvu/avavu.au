<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import Subscribe from '$lib/components/Subscribe.svelte'
</script>

<Meta title="Subscribe" />

<Block colStart={3} colSpan={2} depth={3}>
	{#snippet heading()}
		subscribe
	{/snippet}

	<div class="mx-2 border bg-white py-4">
		<Subscribe />
	</div>
</Block>
