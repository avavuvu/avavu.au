<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
</script>

<Meta title="Crossword Dot Blue" description="Ava's personal crossword website, Crossword.blue" />

<Block colStart={1} depth={4} background>
	{#snippet heading()}
		crossword.blue
	{/snippet}

	<p>
		Crossword.blue is my personal crossword website. It is also my baby. It was the first
		serious web design project I undertook, and it taught me how to make interactive media.
	</p>

	<p>I haven't written a crossword for it in a while.</p>

	<a href="https://crossword.blue"> crossword.blue </a>
</Block>
