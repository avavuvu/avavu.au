<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
import { fade } from 'svelte/transition'

	const { children, data } = $props()
</script>

<Block colStart={3} depth={3}>
	{#snippet heading()}
		crosswords
	{/snippet}

	<ul>
		<li>
			<a href="/games/crosswords/blue"> crossword.blue </a>
		</li>
		<li>
			<a href="/games/crosswords/sqt"> saturday quiz time </a>
		</li>
	</ul>
</Block>

{@render children()}
