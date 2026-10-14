<script lang="ts">
	import type { Link } from '$lib'

	const { links = [] }: { links?: Link[] } = $props()
</script>

{#if links.length > 0}
	<h2>See also</h2>
	<ul>
		{#each links as { title, url, source }}
			<li>
				{#if source}{source} —
				{/if}<a href={url}>{title}</a>
			</li>
		{/each}
	</ul>
{/if}
