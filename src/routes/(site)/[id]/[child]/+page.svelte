<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'
	import WikiEntry from '$lib/components/wiki/WikiEntry.svelte'

	const { data } = $props()
</script>

<Meta
	title={data.entry.metadata.title}
	description={data.entry.plainText}
	image={data.entry.firstImage || undefined}
	canonical={data.canonical}
/>

<WikiEntry
	metadata={data.entry.metadata}
	component={data.component}
	members={data.members}
	categories={data.categories}
	backlinks={data.backlinks}
/>
