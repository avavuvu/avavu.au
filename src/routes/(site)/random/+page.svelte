<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	const { data } = $props()

	onMount(() => {
	    const potentialPages = data.paths.filter(path => !["/random", "/", "/about"].includes(path))
	    const page = potentialPages[Math.floor(Math.random() * potentialPages.length)]

		goto(page, { replaceState: true })
	})
</script>

<noscript>
	<p><a href="/archive">Browse everything</a></p>
</noscript>
