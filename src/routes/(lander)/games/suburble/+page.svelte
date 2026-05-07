<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta title="Suburble"/>

<Block colStart={3} depth={3}>
    {#snippet heading()}
		suburble
	{/snippet}

    <p>
        When you ask someone from Melbourne, "where are you from?" and you haven't heard of it, what do you say to them? I've always found myself asking which train line it's on, or where it's near.
    </p>

    <p>
        Suburble is gamifying that conversational nit. Everyday, there's a new Melbourne suburb that you must deduce from a set of clues.
    </p>

    <p>
        <a href="https://suburble.melbourne">suburble</a>
    </p>
</Block>