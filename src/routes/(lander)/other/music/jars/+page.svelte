<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
</script>

<Meta title="Life In Jars" />

<Block colStart={1} depth={4} background>
	{#snippet heading()}
		life in jars
	{/snippet}

	<p>
		From 2021: "I really hope you like my album. I made it on my computer. Its starts off pretty
		high energy and then gets friendlier and calmer each song."
	</p>

	<p>
		<a href="https://anemia.bandcamp.com/album/life-in-jars">Listen here</a>
	</p>

	<img src="/images/music/jars.webp" alt="Life in Jars Album cover" />
</Block>
