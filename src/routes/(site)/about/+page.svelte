<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'

	const { data } = $props()
</script>

<Meta title="About" description="About Ava Dinh-Vu" canonical={data.canonical} />

<h1>About</h1>

<ul>
	<li><a href="/me">about me</a></li>
	<li><a href="/contact">contact</a></li>
	<li><a href="/wiki">wiki</a></li>
	<li><a href="/music">music</a></li>
</ul>

<data.component />
