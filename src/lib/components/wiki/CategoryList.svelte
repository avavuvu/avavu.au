<script lang="ts">
	import { getMarkdownContent, type MarkdownEntry, type MarkdownFrontmatter } from '$lib'
	import type { Snippet } from 'svelte'

	const { category, children }: { category: string, children?: Snippet } = $props()

	const sectionKeys = ['projects', 'bio', 'glossary'] as const

	type Entry = MarkdownEntry<MarkdownFrontmatter>

	const pages = sectionKeys
		.flatMap((section) => getMarkdownContent<Entry>(section))
		.filter((entry) => entry.data.metadata.tags?.includes(category))
		.sort((a, b) => a.data.metadata.title.localeCompare(b.data.metadata.title))
</script>

<div class="border p-2">
    {#if children}
        {@render children()}
    {:else}
        <p>Pages tagged as <span class="font-bold">{category}:</span></p>
    {/if}
	<ul>
		{#each pages as page}
			<li>
				<a href="/wiki/{page.id}">{page.data.metadata.title}</a>
			</li>
		{/each}
	</ul>
</div>

<style>

</style>
