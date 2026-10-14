<script lang="ts">
	import type { Snippet } from 'svelte'
	import WikiFrame from './WikiFrame.svelte'

	const {
		src,
		poster,
		children,
		align = 'right',
		autoplay = false,
		loop = autoplay,
		muted = autoplay,
		controls = !autoplay
	}: {
		src: string
		poster?: string
		children?: Snippet
		align?: 'center' | 'left' | 'right'
		autoplay?: boolean
		loop?: boolean
		muted?: boolean
		controls?: boolean
	} = $props()
</script>

<WikiFrame {align}>
	<video
		{src}
		{poster}
		{autoplay}
		{loop}
		{muted}
		{controls}
		preload={autoplay ? undefined : 'none'}
		playsinline
	></video>

	{#if children}
		{@render children()}
	{/if}
</WikiFrame>
