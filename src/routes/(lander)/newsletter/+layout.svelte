<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Subscribe from '$lib/components/Subscribe.svelte'

	const { children, data } = $props()
</script>

<Block colStart={5} depth={2}>
	{#snippet heading()}
		my monthly newsletter
	{/snippet}
	<p>My newsletter is sent out on the first of every month.</p>

	<p><a href="/newsletter/subscribe">Click here to subscribe</a></p>

	<ul>
		{#each data.newsletters.reverse() as newsletter}
			<li>
				<a href="/newsletter/{newsletter.id}">
					{newsletter.data.metadata.title}
				</a>
			</li>
		{/each}
	</ul>
</Block>

{@render children()}
