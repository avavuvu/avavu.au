<script lang="ts">
	import type { Snippet } from 'svelte'

	const { children }: { children: Snippet } = $props()
</script>

<div class="most">{@render children()}</div>
