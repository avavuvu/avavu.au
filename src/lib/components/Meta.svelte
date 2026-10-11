<script lang="ts">
	import { page } from '$app/state'
	import { PUBLIC_SITE_URL } from '$env/static/public'

	const {
		description = "Ava Dinh-Vu's Portfolio",
		title = 'Ava Dinh-Vu',
		image,
		canonical,
		noindex = false
	}: {
		description?: string
		title?: string
		image?: string
		canonical?: string
		noindex?: boolean
	} = $props()

	const PAGES_WITHOUT_MARKDOWN = ['/archive', '/random', '/graph']

	const path = $derived(canonical ?? page.url.pathname)
	const canonicalUrl = $derived(`${PUBLIC_SITE_URL}${path}`)
	const hasMarkdown = $derived(
		!noindex &&
			path !== '/' &&
			!PAGES_WITHOUT_MARKDOWN.some(
				(prefix) => path === prefix || path.startsWith(`${prefix}/`)
			)
	)
</script>

<svelte:head>
	<title>
		{title}
	</title>

	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:url" content={canonicalUrl} />

	{#if hasMarkdown}
		<link rel="alternate" type="text/markdown" href="{path}.md" />
	{/if}

	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />
	<meta name="description" content={description} />

	<meta property="og:type" content="website" />

	{#if image}
		<meta name="twitter:card" content="summary_large_image" />
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
