<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
</script>

<Meta
	title="Live Coders Naarm"
	description="Website for Melbourne's premiere (and maybe only) community of live coders"
/>

<Block colStart={3} depth={3} background>
	{#snippet heading()}
		live coders naarm
	{/snippet}

	<p>Website for Melbourne's premiere (and maybe only) community of live coders</p>

	<p>
		<a href="https://naarm.lc">naarm.lc</a>
	</p>
</Block>
