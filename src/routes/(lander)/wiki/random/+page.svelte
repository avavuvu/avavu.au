<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'

	let { data } = $props()

	onMount(() => {
		const id = data.ids[Math.floor(Math.random() * data.ids.length)]
		goto(`/wiki/${id}`, { replaceState: true })
	})
</script>

<noscript>
	<p><a href="/wiki">Browse the wiki</a></p>
</noscript>
