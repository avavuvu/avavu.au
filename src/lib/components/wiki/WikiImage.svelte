<script lang="ts">
	import type { Snippet } from 'svelte'
	import WikiFrame from './WikiFrame.svelte'

	const {
		src,
		children,
		alt,
		align = 'right'
	}: {
		src: string
		children?: Snippet
		alt: string
		align?: 'center' | 'left' | 'right'
	} = $props()
</script>

<WikiFrame {align}>
	<img {src} {alt} />

	<div>
	    {@render children?.()}
	</div>
</WikiFrame>

<style>
    img {
        margin-bottom: 0 !important;
    }

    div {
        padding: 0 0.5em 0.5em;
    }
</style>
