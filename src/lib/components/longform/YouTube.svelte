<script lang="ts">
	const { id, start }: { id: string; start?: number } = $props()

	$effect(() => {
		import('@justinribeiro/lite-youtube')
	})
</script>

<lite-youtube videoid={id} params={start ? `start=${start}` : undefined}></lite-youtube>
