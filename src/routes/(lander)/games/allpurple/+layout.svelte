<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'

	const { children } = $props()
</script>

<Meta
	title="The All Purple Challenge"
	description="Very hard version of the New York Times' Connections"
/>

<Block colStart={3} depth={3} background>
	{#snippet heading()}
		All Purple Challenge
	{/snippet}

	<p>The All Purple challenge was my spin on the New York Times' Connections</p>

	<p>After you solve it, four of yours answers get shuffled into the next board.</p>

	<p>
		It was called the All Purple challenge because in Connections, the Purple category is the
		hardest difficulty, but here, everything is Purple difficulty.
	</p>

	<ul>
		<li>
			<a href="/games/allpurple/01">all purple 01</a>
		</li>
		<li>
			<a href="/games/allpurple/02">all purple 02</a>
		</li>
	</ul>
</Block>

{@render children()}
