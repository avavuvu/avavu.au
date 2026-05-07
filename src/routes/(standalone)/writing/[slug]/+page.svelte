<script lang="ts">
	import type { Component } from 'svelte'
	import { fade } from 'svelte/transition'
	import "./article.css"

	let {
		data
	}: {
		data: any
	} = $props()

	
</script>

<div class="content col-span-2 mx-6 overflow-y-scroll px-2 lg:mx-20 essay" in:fade>
	<h1>
		{data.metadata.title}
	</h1>

	<div class="markdown-container">
		{@html data.html}
		
			

	</div>

</div>
