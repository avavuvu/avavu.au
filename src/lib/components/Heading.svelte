<script lang="ts">
	import type { Snippet } from "svelte"

    const { children, level }: {
        children?: Snippet,
        level: number
    } = $props()
</script>

<svelte:element this={`h${level}`}>
    {@render children?.()}
</svelte:element>