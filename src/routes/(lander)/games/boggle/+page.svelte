<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta 
	title="Beat Me At Boggle"
	description="Daily Boggle game online"
/>

<Block colStart={3} depth={3}>
    {#snippet heading()}
        Beat Me @ Boggle
    {/snippet}

    <p>
        The best part of Boggle, as I have discovered, is the competition. Beat Me At Boggle is my attempt to replicate that ferocious competition for the information age. Everyday I play a game of Boggle, and the next day you try and beat my score.
    </p>

    <p>
        <a href="https://beatmeatboggle.com">beat me at boggle</a>
    </p>
</Block>