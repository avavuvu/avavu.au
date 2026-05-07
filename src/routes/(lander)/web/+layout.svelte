<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
import { fade } from 'svelte/transition'

	const { children, data } = $props()
</script>

<Block colStart={5} depth={2}>
	{#snippet heading()}
		<a href="/">web design</a>
	{/snippet}

	<ul>
		<li>
			<a href="/web/radiofodder"> radio fodder </a>
		</li>
	</ul>

	<!-- <h2>corporate</h2>

	<ul>
		<li>
			<a href="/web/runandgets"> run and gets </a>
		</li>
	</ul> -->
</Block>

{@render children()}
