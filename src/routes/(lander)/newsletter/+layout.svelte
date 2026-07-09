<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Subscribe from '$lib/components/Subscribe.svelte'
	import { getMarkdownContent } from '$lib'

	const { children, data } = $props()

	const local = getMarkdownContent('newsletter')
	const external = data.externalNewsletters.map((e) => ({
		id: e.slug,
		title: e.title,
		date: e.date
	}))
	const newsletters = [
		...local.map((n) => ({
			id: n.id,
			title: n.data.metadata.title,
			date: n.data.metadata.date
		})),
		...external
	]
</script>

<Block colStart={5} depth={2}>
	{#snippet heading()}
		my monthly newsletter
	{/snippet}
	<p>My newsletter is sent out on the first of every month.</p>

	<p><a href="https://ava.room.lc">Click here to subscribe</a></p>

	<ul>
		{#each newsletters.reverse() as newsletter}
			<li>
				<a href="/newsletter/{newsletter.id}">
					{newsletter.title}
				</a>
			</li>
		{/each}
	</ul>
</Block>

{@render children()}
