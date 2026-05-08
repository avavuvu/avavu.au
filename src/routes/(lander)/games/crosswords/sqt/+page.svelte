<script>
	import Block from '$lib/components/lander/Block.svelte'
	import Meta from '$lib/components/Meta.svelte'
	import { fade } from 'svelte/transition'
</script>

<Meta 
	title="Saturday Quiz Time Crosswords"
	description="The crosswords Ava has written for Saturday Quiz Time"
/>

<Block colStart={1} depth={4}>
	{#snippet heading()}
		saturday quiz time
	{/snippet}
	
	<p>
		I contribute puzzles to Australian quiz website <a
			href="https://www.saturdayquiztime.com.au/">Saturday Quiz Time</a
		>
	</p>

	<p>Here are some of my puzzles</p>
	<ul>
		<li>
			<a href="https://www.saturdayquiztime.com.au/editions/298/crossword/">
				March 7th, 2026
			</a>
		</li>
		<li>
			<a href="https://www.saturdayquiztime.com.au/editions/296/crossword/">
				February 21, 2026
			</a>
		</li>
		<li>
			<a href="https://www.saturdayquiztime.com.au/editions/284/crossword/">
				November 11, 2025
			</a>
		</li>
		<li>
			<a href="https://www.saturdayquiztime.com.au/editions/260/crossword/">
				July 14, 2025
			</a>
		</li>
		
	</ul>
</Block>
