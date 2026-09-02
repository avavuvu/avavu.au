<script lang="ts">
	import type { Snippet } from "svelte"
	import WikiFrame from './WikiFrame.svelte'

    const { src, children, alt, align = "right" }: {
        src: string,
        children: Snippet
        alt: string,
        align?: "center" | "left" | "right"
    } = $props()
</script>

<WikiFrame {align}>
    <img src="{src}" alt="{alt}"/>

    {@render children()}
</WikiFrame>
