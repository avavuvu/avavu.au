<script lang="ts">
	import type { Member } from '$lib'
	import FormattedDate from '$lib/components/FormattedDate.svelte'

	const {
		title,
		date,
		categories = []
	}: {
		title: string
		date?: string
		categories?: Member[]
	} = $props()
</script>

<header>
	<hgroup>
		<h1>{title}</h1>
		{#if date}
			<p><FormattedDate {date} /></p>
		{/if}
	</hgroup>

	{#if categories.length > 0}
		<ul class="categories">
			{#each categories as { href, title }}
				<li><a {href}>{title}</a></li>
			{/each}
		</ul>
	{/if}
</header>

<style>
	hgroup {
		display: flex;
		justify-content: space-between;
		align-items: baseline;

		h1,
		p {
			margin: 0;
		}
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		margin: 0;
		padding: 0;
		font-style: italic;

		li {
			margin: 0;
			list-style: none;
		}
	}
</style>
