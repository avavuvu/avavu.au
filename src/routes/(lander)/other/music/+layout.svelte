<script>
	import Block from "$lib/components/lander/Block.svelte"

	const { children } = $props()
</script>

<Block colStart={3} depth={3}>
    {#snippet heading()}
		music
	{/snippet}

	<h2>as anemia</h2>

    <ul>
		<li>
			<a href="/other/music/bmay">
				Between Me & You (2023)
			</a>
		</li>
		<li>
			<a href="/other/music/apoc">
				How to Look Forward to the Apocalypse (2022)
			</a>
		</li>
		<li>
			<a href="/other/music/jars">
				Life in Jars (2021)
			</a>
		</li>
	</ul>
    
</Block>

{@render children()}
