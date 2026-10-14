<script lang="ts">
	import './longform.css'
	import type { Component } from 'svelte'
	import type { Image, Link, Member } from '$lib'
	import EntryHeader from '$lib/components/EntryHeader.svelte'
	import SeeAlso from '$lib/components/SeeAlso.svelte'

	const {
		title,
		date,
		categories,
		subtitle,
		image,
		links,
		source,
		component,
		html
	}: {
		title: string
		date?: string
		categories?: Member[]
		subtitle?: string
		image?: Image
		links?: Link[]
		source?: { href: string; label: string }
		component?: Component | null
		html?: string | null
	} = $props()

	const Content = $derived(component)
</script>

<div class="longform">
	{#if image}
		<img src={image.src} alt={image.alt} />
	{/if}

	<EntryHeader {title} {date} {categories} />

	{#if subtitle}
		<p><i>{subtitle}</i></p>
	{/if}

	{#if source}
		<p><a href={source.href}>{source.label}</a></p>
	{/if}

	<div class="markdown-container">
		<article>
			{#if Content}
				<Content />
			{:else if html}
				{@html html}
			{/if}
		</article>
	</div>

	<SeeAlso {links} />
</div>
