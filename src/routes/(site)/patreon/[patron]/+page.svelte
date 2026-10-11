<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()
</script>

<Meta
	title={data.patron.name}
	description="{data.patron.name} is a Patreon subscriber"
	canonical={data.canonical}
	noindex
/>

<article>
	<h1>{data.patron.name}</h1>

	<p>
		<b>{data.patron.name}</b> is a <a href={data.patreonPath}>Patreon</a> subscriber.
		{#if data.patron.tier}
			They subscribed to the <b>{data.patron.tier}</b> tier.
		{/if}
	</p>
</article>
