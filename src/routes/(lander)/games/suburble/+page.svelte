<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
</script>

<Meta title="Suburble" />

<Block colStart={3} depth={3} background>
	{#snippet heading()}
		suburble
	{/snippet}

	<p>
		When someone tells you where they're from, and you don't know, it's natural to ask where it
		is in relation to a river, or a harbour, or the mountains.
	</p>

	<p>
		But Melbourne is mostly flat, with a river that isn’t a great dividing force. Instead, I
		hear people ask about their train line.
	</p>

	<p>
		Suburble is that conversational nit turned into a game. Everyday, there's a new Melbourne
		suburb that you must deduce from a set of clues.
	</p>

	<p>
		<a href="https://suburble.melbourne">suburble</a>
	</p>
</Block>
