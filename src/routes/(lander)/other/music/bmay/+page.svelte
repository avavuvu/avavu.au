<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta
	title="Between Me and You"
/>


<Block colStart={1} depth={4}>
    {#snippet heading()}
		between me and you
	{/snippet}

    <p>
        From 2023: "Five tender songs about my life. If you like the sound subway trains make as they leave the station you'll like these songs."
    </p>

    <p>
        <a href="https://anemia.bandcamp.com/album/between-me-you">Listen here</a>
    </p>
    
    <img src="/images/music/bmay.webp" alt="Between Me And you Album cover">

</Block>