<script lang="ts">
	import type { Component } from 'svelte'
	import { fade } from 'svelte/transition'
	import "./article.css"

	let {
		data
	} = $props()

	$effect(() => {
		if (data) {
			import('@justinribeiro/lite-youtube')
		}
	})

	
</script>

<div class="content col-span-2 mx-6 overflow-y-scroll px-2 lg:mx-20 essay" in:fade>
	<img src={data.metadata.heroImageSrc}>


	<h1>
		{data.metadata.title}
	</h1>



	<div class="markdown-container">
		{@html data.html}
		
			

	</div>

</div>
