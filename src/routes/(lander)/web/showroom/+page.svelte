<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
</script>

<Meta title="Showroom" description="Emails for the little guy" />

<Block colStart={3} depth={3} background>
	{#snippet heading()}
		show room
	{/snippet}

	<p>Showroom is an email service</p>

	<p>
		<a href="https://show.room.lc">show room</a>
	</p>
</Block>
