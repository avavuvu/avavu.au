<script lang="ts">
	import { fade } from 'svelte/transition'
	import './article.css'
	import '../../../layout.css'

	let { data } = $props()

	const formattedDate = new Date(data.metadata.date).toLocaleDateString('EN-AU', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})

	$effect(() => {
		if (data) {
			import('@justinribeiro/lite-youtube')
		}
	})

	let button: HTMLElement = $state(undefined!)

	const share = () => {
		const url = window.location.href
		if (navigator.share) {
			navigator.share({
				text: data.metadata.title,
				url: url!
			})
		} else {
			navigator.clipboard.writeText(`${url}`)
			button.querySelector('span')!.innerHTML = 'copied to clipboard'
		}
	}
</script>

<nav class="sticky top-0 z-100">
	<a href="/" class="block h-12 bg-[blue] text-white">
		<span class="block translate-y-0.5 scale-x-75 scale-y-[2] text-center font-serif text-4xl">
			avavu
		</span>
	</a>

	<div class="absolute w-fit origin-left scale-x-75 bg-[blue] font-serif text-white">
		<a href="/other/writing" class=" block h-12">
			<span class=" block origin-left translate-y-0.5 scale-y-[2] font-serif text-4xl">
				more
			</span>
		</a>

		<button
			onclick={share}
			bind:this={button}
			class="block h-12 -translate-y-0.5 cursor-pointer text-white"
		>
			<span class="block origin-left translate-y-0.5 scale-y-[2] font-serif text-4xl">
				share
			</span>
		</button>
	</div>
</nav>

<img
	class="mx-auto max-w-[90%]"
	src={data.metadata.heroImageSrc}
	alt={data.metadata.heroImageAlt}
/>

<div class="content essay col-span-2 mx-0 overflow-y-scroll px-2 pb-24 lg:mx-20" in:fade>
	<div class="bg-[blue] font-bold text-white">
		<div class="origin-left scale-x-75 px-4">
			<h1 class="w-[125%] text-5xl">{data.metadata.title}</h1>
		</div>
	</div>

	<p>{formattedDate}</p>

	<div class="markdown-container">
		{@html data.html}
	</div>
</div>

{#if data.metadata.links}
	<div class="mx-auto max-w-200 pb-24">
		<h2 class="text-2xl font-bold">See also</h2>
		<ul class="list-none">
			{#each data.metadata.links as { title, pub, url }}
				<li class="grid grid-cols-[15rem_auto] gap-1">
					<span class="text-gray-500">{pub}</span> <a href={url}>{title}</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
