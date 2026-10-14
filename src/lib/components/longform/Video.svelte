<script lang="ts">
	const { src, type = 'video/mp4' }: { src: string; type?: string } = $props()
</script>

<video controls><source {src} {type} /></video>
