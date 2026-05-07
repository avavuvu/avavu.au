<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta
	title="Radio Fodder"
	description="The web design of Radio Fodder, Melbourne University's online student radio station"
/>

<Block colStart={3} depth={3}>
    {#snippet heading()}
        radio fodder
    {/snippet}

    <p>
        Radio Fodder is Melbourne University's online student radio station.
    </p>

    <p>
        I was asked to make a website that was amazingly simple, as to not distract from the music and the shows.
        Still, I think the vibrant personality of the radio station shines through.

    </p>

    <p>
        <a href="https://radiofodder.live">radio fodder</a>
    </p>
</Block>