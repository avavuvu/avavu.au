<script>
	import Block from '$lib/components/lander/Block.svelte'

	const { children } = $props()
</script>

<Block colStart={3} depth={3} background>
	{#snippet heading()}
		music
	{/snippet}

	<h2>as anemia</h2>
	<p><i>anemia</i> is my now retired musical alter-ego</p>

	<ul>
		<li>
			<a href="/other/music/bmay"> Between Me & You (2023) </a>
		</li>
		<li>
			<a href="/other/music/apoc"> How to Look Forward to the Apocalypse (2022) </a>
		</li>
		<li>
			<a href="/other/music/jars"> Life in Jars (2021) </a>
		</li>
	</ul>

	<!-- <h2>live coding</h2>
	<p>
		<i>live coding</i> is programming as performance art. its ephemeral nature makes it hard to document
	</p> -->
</Block>

{@render children()}
