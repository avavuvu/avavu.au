<script lang="ts">
	const { id }: { id: string } = $props()

	$effect(() => {
		import('@justinribeiro/lite-tiktok')
	})
</script>

<lite-tiktok videoid={id}></lite-tiktok>
