<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	const { data } = $props()

	onMount(() => {
		goto(data.paths[Math.floor(Math.random() * data.paths.length)], { replaceState: true })
	})
</script>

<noscript>
	<p><a href="/archive">Browse everything</a></p>
</noscript>
