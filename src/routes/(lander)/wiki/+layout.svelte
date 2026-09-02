<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import { getMarkdownContent, type MarkdownEntry, type MarkdownFrontmatter } from '$lib'

	const { children } = $props()

	const sectionKeys = ['projects', 'bio', 'people', 'glossary'] as const

	type Page = MarkdownEntry<MarkdownFrontmatter>

	const pages = sectionKeys
		.flatMap((section) =>
			getMarkdownContent<Page>(section).map((entry) => ({
				section,
				id: entry.id,
				title: entry.data.metadata.title ?? entry.id
			}))
		)
		.sort((a, b) => a.title.localeCompare(b.title))
</script>

<Block colStart={5} colSpan={2} depth={2}>
	{#snippet heading()}
		about
	{/snippet}

	<ul>
		<li>
			<a href="/wiki/me">me</a>
		</li>
		<li>
			<a href="/wiki/contact">contact</a>
		</li>
		<li>
			<a href="/wiki/ava-wiki">wiki</a>
		</li>
	</ul>

	<ul>
		<li>
			<a class="no-link" href="https://www.instagram.com/avadinhvu/">instagram</a>
		</li>
		<li>
			<a class="no-link" href="https://www.linkedin.com/in/ava-dinh-vu-399163414/">linkedin</a>
		</li>
	</ul>

	<ul>
		<li>
			<a href="/wiki/random">random page</a>
		</li>
	</ul>
</Block>

{@render children()}
