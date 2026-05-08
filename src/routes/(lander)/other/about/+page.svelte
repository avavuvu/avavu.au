<script>
	import Block from "$lib/components/lander/Block.svelte"
	import Meta from "$lib/components/Meta.svelte"

</script>

<Meta
	title="About Ava Dinh-Vu"
	description="Ava Dinh-Vu is a designer from Melbourne, Australia"
/>

<Block colStart={3} depth={3}>
    {#snippet heading()}
		about ava dinh-vu
	{/snippet}

    <p>
		My name is Ava Dinh-Vu and this is my website.
	</p>

	<p>
		I like the internet and wearing many hats. 
	</p>

	<p>
		If you think there is something I should know, send me an email at <a href="mailto:avadinhvu@gmail.com">avadinhvu@gmail.com</a>
	</p>
    
</Block>