<script lang="ts">
	import Meta from '$lib/components/Meta.svelte'
	import WikiEntry from '$lib/components/wiki/WikiEntry.svelte'

	const { data } = $props()
</script>

<Meta title="Ava Dinh-Vu's Essays" description={data.entry.plainText} />

<WikiEntry
	metadata={data.entry.metadata}
	component={data.component}
	members={data.members}
	categories={data.categories}
	backlinks={data.backlinks}
/>
