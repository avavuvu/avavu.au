<script lang="ts">
	import { PUBLIC_SITE_URL } from "$env/static/public"

    const { description = "Ava Dinh-Vu's Portfolio", title = "Ava Dinh-Vu", image }: {
        description?: string,
        title?: string,
        image?: string
    } = $props()
</script>

<svelte:head>
<title>
    {title}
</title>

<meta property="og:title" content={title} />
<meta name="twitter:title" content={title} />
<meta property="og:description" content={description} />
<meta name="twitter:description" content={description} />
<meta name="description" content={description} />

<meta property="og:type" content="website" />

{#if image}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:image" content="{image}" />
    <meta name="twitter:image" content="{image}" />
{/if}
</svelte:head>	