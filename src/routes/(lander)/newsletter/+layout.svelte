<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'

	const { children, data } = $props()
</script>



<Block colStart={5} depth={2}>
	{#snippet heading()}
		my monthly newsletter
	{/snippet}
	<p>I enjoy the form of a newsletter.</p>
	
	<ul>
		{#each data.newsletters.toReversed() as newsletter}
			<li>
				<a href="/newsletter/{newsletter.id}">
					{newsletter.data.metadata.title}
				</a>
			</li>
		{/each}
	</ul>
</Block>

{@render children()}
