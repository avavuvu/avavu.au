<script lang="ts">
	import type { Snippet } from 'svelte'
	import WikiFrame from './WikiFrame.svelte'

	const {
		src,
		children,
		align = 'right',
		autoplay = false,
		loop = autoplay,
		muted = autoplay,
		controls = !autoplay
	}: {
		src: string
		children?: Snippet
		align?: 'center' | 'left' | 'right'
		autoplay?: boolean
		loop?: boolean
		muted?: boolean
		controls?: boolean
	} = $props()
</script>

<WikiFrame {align}>
	<video {src} {autoplay} {loop} {muted} {controls} playsinline></video>

	{#if children}
		{@render children()}
	{/if}
</WikiFrame>
