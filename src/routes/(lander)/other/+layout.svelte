<script lang="ts">
	import Block from '$lib/components/lander/Block.svelte'
	import { fade } from 'svelte/transition'

	const { children, data } = $props()
</script>

<Block colStart={5} depth={2}>
	{#snippet heading()}
		other things
	{/snippet}

	<ul>
		<li>
			<a href="/other/about"> about me </a>
		</li>
		<!-- <li>
			<a href="/other/website"> about this website </a>
		</li> -->
		<li>
			<a href="/other/writing"> essays </a>
		</li>
		<li>
			<a href="/other/music"> music </a>
		</li>
	</ul>

	<ul>
		<li>
			<a class="no-link" href="https://www.instagram.com/avadinhvu/"> instagram </a>
		</li>
		<li>
			<a class="no-link" href="https://www.linkedin.com/in/ava-dinh-vu-399163414/">
				linkedin
			</a>
		</li>
	</ul>
</Block>

{@render children()}
