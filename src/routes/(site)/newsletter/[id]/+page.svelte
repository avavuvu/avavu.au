<script lang="ts">
	import EntryPage from '$lib/components/EntryPage.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import LongForm from '$lib/components/longform/LongForm.svelte'

	const { data } = $props()
</script>

{#if data.entry && data.component}
	<EntryPage data={{ ...data, entry: data.entry, component: data.component }} />
{:else if data.external}
	<Meta
		title={data.external.title}
		description={data.external.preheader}
		canonical={data.canonical}
	/>

	<LongForm
		title={data.external.title}
		date={data.external.date}
		categories={data.categories}
		subtitle={data.external.preheader}
		source={{
			href: `https://ava.room.lc/${data.external.slug}`,
			label: 'This newsletter is better read on Showroom'
		}}
		html={data.external.html}
	/>
{/if}
