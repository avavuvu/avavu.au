<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()

	const metadata = $derived(data.metadata)
</script>

<Meta title={metadata.title} description={metadata.preheader} canonical={data.canonical} />

<article>
	<h1>{metadata.title}</h1>
	<p><i>{metadata.preheader}</i></p>

	{#if data.component}
		<data.component />
	{:else if data.html}
		<p>
			<a href="https://ava.room.lc/{data.slug}">This newsletter is better read on Showroom</a>
		</p>
		{@html data.html}
	{/if}
</article>
