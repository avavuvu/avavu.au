<script lang="ts">
	import type { Snippet } from 'svelte'

	const { children }: { children: Snippet } = $props()
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption>{@render children()}</figcaption>
