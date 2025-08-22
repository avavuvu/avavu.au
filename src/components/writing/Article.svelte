<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    
    const {
        bodyMarkdown,
        descriptionMarkdown,
        data
    }: {
        bodyMarkdown: string
        descriptionMarkdown: string,
        data: CollectionEntry<"writing">["data"],

    } = $props();

    const { date, author, title, heroImageSrc, heroImageAlt } = data

    const heroImagePrimary = typeof heroImageSrc === "string"
        ? heroImageSrc
        : heroImageSrc[0]

    const heroImageSecondary = typeof heroImageSrc !== "string"
        ? heroImageSrc
        : []

    const heroImageCompat = heroImageSecondary.find(src => src.endsWith(".png") || src.endsWith(".jpg"))

    const formattedDate = date.toLocaleDateString("EN-AU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })


  import Subscribe from "../newsletter/Subscribe.svelte";

    const hasHeroImageCss = heroImageSrc ? `grid-cols-[40%_auto_40%]` : `grid-cols-[auto]`
    const hasHeroImageDescriptionCss = heroImageSrc ? `col-start-3 col-end-4` : ``
    const hasHeroImageeInfoCss = heroImageSrc ? `col-start-2 col-end-4` : ``

</script>

<section class="font-system text-lg">
    <div class="md:grid lg:grid {hasHeroImageCss} grid-rows-[75%_auto_auto]">
        <div class="{hasHeroImageeInfoCss} row-start-1 row-end-2">
            <div>
                <div class="flex flex-col lg:min-h-96 md:min-h-96 mt-6 
                    md:items-right lg:items-right text-right px-12">
                    <h1
                        class="lg:text-9xl md:text-8xl text-6xl scale-x-75 origin-right font-serif
                        tracking-tighter text-right lg:p-4 px-1 py-2 hyphens-auto break-keep">
                        {title} 
                    </h1>
                    <p>
                        by {author}
                    </p>
                    <p>{formattedDate}</p>
                </div>
            </div>
        </div>

        {#if heroImageSrc}
            <div class="w-full h-full col-start-1 col-end-3 row-start-1 row-end-3 -z-40 relative p-10">
                <picture>
                    {#each heroImageSecondary as image}
                        <source srcset={image}/>
                    {/each}

                    <img src={heroImagePrimary} alt={heroImageAlt}>
                </picture>
            </div> 
        {/if}
        
        <div class="{hasHeroImageDescriptionCss} row-start-2 row-end-4 flex lg:items-center md:items-center ">
            <div class="
                text-1xl mx-auto
                lg:py-20 lg:pr-20 lg:text-2xl
                md:py-20 md:pr-20
                pb-10
                px-12 text-right">
                {@html descriptionMarkdown}
            </div>
        </div>

    </div>

    <div class="markdown grid 
        grid-cols-[1rem_auto_1rem]
        lg:grid-cols-[1fr_620px_1fr] max-w-fit mx-auto">
        <div></div>
        {@html bodyMarkdown}
        <div></div>
    </div>

    <div class="border-b border-black max-w-main mx-auto my-2"></div>


    <div class="max-w-[600px] mx-auto grid grid-cols-2 gap-4 px-4">
        <a 
            class="bg-main" 
            aria-label="Author"
            href="/about">
            <div>

                <img class="w-full h-full" src="/assets/me.webp" alt="">
        </div>

        </a>
        <div>
            <a href="/about" class="font-bold underline">
                {author}
            </a> 
            {#if author === "Ava Vu"}
                <p class="">
                    i'm a web designer, graphic designer, and game maker. i like art and other people. 
                </p>
            {/if}
        </div>
    </div>

    <div class="border-b border-black max-w-main mx-auto my-2"></div>
</section>

<section class="font-system">
    <div class="max-w-main mx-auto">
        <h2 class="text-4xl scale-x-75 text-center">Not Enough Ava?</h2>
        <p class="text-center py-12">Subscribe to my newsletter!</p>
        <Subscribe></Subscribe>
    </div>

    <div class="pb-48">
        
    </div>

</section>

<style>
    :global(.markdown blockquote::before) {
        content: open-quote;
        position: absolute;
        transform: scale(5) translateY(.25rem) translateX(-.25rem);
        font-family: Impact, Arial, sans-serif;
    }

    :global(.markdown blockquote) {
        position: relative;
        margin: 1rem 2.5rem 0rem 2.5rem;
        border-bottom: 1px solid black;
    }

    :global(.markdown .attribution) {
        position: relative;
        margin: 0rem 1rem 2rem 2.5rem;
    }

    :global(.markdown h1, .markdown h2, .markdown h3) {
        padding: .7rem 0rem;
        font-size: xx-large;
        font-weight: bold;
        font-family: var(--font-serif);
        transform: scaleX(.75);
        transform-origin: left;
    }

    :global(.markdown *) {
        @apply col-start-2 col-end-3;
    }

    :global(.markdown > p) {
        font-size: 20px;
        line-height: 1.4;
        margin: 0 0 16px;
    }

    :global(.markdown a) {
        color: var(--color-blue)
    }

    :global(.markdown a:hover) {
        color: var(--color-white);
        background: var(--color-blue);
    }


    
    :global(p:has(.markdown-img)) {
        @apply col-start-1 col-end-4;
        padding: 2rem 0rem;
    }

</style>