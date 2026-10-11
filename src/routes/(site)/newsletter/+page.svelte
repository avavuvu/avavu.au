<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()
</script>

<Meta
	title="Newsletter"
	description="Ava Dinh-Vu's monthly newsletter, which is sent on the first day of every month"
/>

<h1>Newsletter</h1>

<data.component />

<p><a href="https://ava.room.lc">Subscribe</a></p>

<ul>
	{#each data.members as { href, title }}
		<li><a {href}>{title}</a></li>
	{/each}
</ul>
