<script lang="ts">
	import EntryPage from '$lib/components/EntryPage.svelte'

	const { data } = $props()
</script>

<EntryPage {data} />
