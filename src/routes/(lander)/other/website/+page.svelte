<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta
	title="About avavu.au"
/>

<Block colStart={3} depth={3}>
    {#snippet heading()}
		about avavu.au
	{/snippet}

    hi
    
</Block>