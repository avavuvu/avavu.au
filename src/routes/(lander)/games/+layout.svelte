<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
import { fade } from 'svelte/transition'

	const { children, data } = $props()
</script>

<Block colStart={5}  depth={2}>
	{#snippet heading()}
		my games
	{/snippet}

	<ul>
		<li>
			<a href="/games/suburble"> suburble </a>
		</li>
		<li>
			<a href="/games/crosswords"> crosswords </a>
		</li>
		<li>
			<a href="/games/boggle"> beat me at boggle</a>

		</li>
		<li>
			<a href="/games/allpurple"> all purple </a>
		</li>

		
	</ul>
</Block>

{@render children()}
