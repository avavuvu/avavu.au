<script lang="ts">
	import type { Component } from 'svelte'
	import type { ContentEntry, Entry, Member } from '$lib'
	import Meta from '$lib/components/Meta.svelte'
	import LongForm from '$lib/components/longform/LongForm.svelte'
	import WikiEntry from '$lib/components/wiki/WikiEntry.svelte'

	const {
		data
	}: {
		data: {
			entry: ContentEntry<Entry>
			component: Component
			members: Member[]
			categories: Member[]
			backlinks: Member[]
			canonical: string
		}
	} = $props()

	const metadata = $derived(data.entry.metadata)
</script>

<Meta
	title={metadata.title}
	description={metadata.description ?? metadata.preheader ?? data.entry.plainText}
	image={metadata.image?.src ?? data.entry.firstImage ?? undefined}
	canonical={data.canonical}
/>

{#if metadata.layout === 'longform'}
	<LongForm
		title={metadata.title}
		date={metadata.date}
		categories={data.categories}
		subtitle={metadata.preheader}
		image={metadata.image}
		links={metadata.links}
		component={data.component}
	/>
{:else}
	<WikiEntry
		{metadata}
		component={data.component}
		members={data.members}
		categories={data.categories}
		backlinks={data.backlinks}
	/>
{/if}
