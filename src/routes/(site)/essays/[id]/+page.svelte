<script lang="ts">
	import './article.css'
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()

	const formattedDate = $derived(
		new Date(data.metadata.date).toLocaleDateString('EN-AU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	)

	$effect(() => {
		import('@justinribeiro/lite-youtube')
	})
</script>

<Meta
	title={data.metadata.title}
	description={data.metadata.description}
	image={data.metadata.heroImageSrc}
	canonical={data.canonical}
/>

<div class="essay">
	{#if data.metadata.heroImageSrc}
		<img src={data.metadata.heroImageSrc} alt={data.metadata.heroImageAlt} />
	{/if}

	<h1>{data.metadata.title}</h1>
	<p>{formattedDate}</p>

	<div class="markdown-container">
		{@html data.html}
	</div>

	{#if data.metadata.links}
		<h2>See also</h2>
		<ul>
			{#each data.metadata.links as { title, pub, url }}
				<li>{pub} — <a href={url}>{title}</a></li>
			{/each}
		</ul>
	{/if}
</div>
