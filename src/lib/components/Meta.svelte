<script lang="ts">
    import { globalState } from "$lib/lander.svelte"
    import { page } from "$app/state"
    import { PUBLIC_SITE_URL } from "$env/static/public"

    const { description = "Ava Dinh-Vu's Portfolio", title = "Ava Dinh-Vu", image, canonical }: {
        description?: string,
        title?: string,
        image?: string,
        canonical?: string
    } = $props()

    const canonicalUrl = $derived(`${PUBLIC_SITE_URL}${canonical ?? page.url.pathname}`)

    $effect(() => {
        if(title === "Ava Dinh-Vu") {
            globalState.setHeader("")
            return
        }

        if(title) {
            globalState.setHeader(title)
        }
    })
</script>

<svelte:head>
<title>
    {title}
</title>

<link rel="canonical" href={canonicalUrl} />
<meta property="og:url" content={canonicalUrl} />

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