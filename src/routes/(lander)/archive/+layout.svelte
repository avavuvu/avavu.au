<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import { fade } from 'svelte/transition'

	const { children, data } = $props()
</script>

<Block colStart={6} colSpan={1} depth={2}>
	{#snippet heading()}
       	sort by
    {/snippet}

	<ul>
		<li>
			<a href="/archive/year"> year </a>
		</li>
		<li>
			<a href="/archive/type"> type </a>
		</li>
		<li>
			<a href="/archive/rating"> how much i like it </a>
		</li>
	</ul>
</Block>

{@render children()}


