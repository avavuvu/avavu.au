<script lang="ts">
    import { slide } from "svelte/transition";
    import type { CollectionEntry } from "astro:content";

    const { music, video, games}: {
        music: CollectionEntry<'music'>[]
        video: CollectionEntry<'video'>[]
        games: CollectionEntry<'games'>[]
    } = $props()

    const collections = [games, music, video, ]

    let collectionSelected: string = $state("music")
    
</script>

{#snippet entry(key: string, data: string)}
    <p>
        {#if data.startsWith("http")}
            <a class="underline max-w-[24ch] text-blue break-all text-ellipsis line-clamp-1" href={data}>{data}</a>
            <span class="inline-flex gap-2 w-full justify-between">
                <span>
                    is the
                </span>
                <span class="font-bold text-right w-min">{key} {key === "url" ? "" : "url"}</span>
            </span>
        {:else}
                {#if key === "description"}
                    <span>here's the <p-span class="font-bold">description:</p-span></span>
                    <span class="italic block ml-3">
                        {data}
                    </span>
                {:else}
                    <span class="inline-flex gap-2 w-full justify-between ">
                        <span class="italic">{data}</span> 
                        <span class="">is&NonBreakingSpace;the </span>
                        <span class=" font-bold text-right">{key}</span>

                    </span>
                {/if}
        {/if}
    </p>
{/snippet}

<div>

    {#each collections as collection}
        {@const collectionName = collection[0].collection}
        <button class="block" onclick={() => {
            if(collectionSelected === collectionName) {
                collectionSelected = ""
                return
            }

            collectionSelected = collectionName 
        }}>
            <h2>{collection[0].collection}</h2>
        </button>
        {#if collectionSelected === collectionName}
            <div transition:slide={{duration: 700}}>
                {#each collection as item}
                    <div class="grid grid-cols-1 lg:grid-cols-[50%_auto] mb-40">
                        <div>
                            {#each Object.entries(item.data) as [key, data]}
                                {#if typeof data === "object"}
                                    {#if key === "links"}
                                        <p-span class="">here are the links</p-span>
                                    {/if}
                                    {#each Object.entries(data) as [subKey, subData]}
                                        <div class="ml-[5%]">
                                            {@render entry(subKey, subData)}
                                        </div>
                                    {/each}
                                {:else}
                                    {#if key !== "imageSrc"}
                                        {@render entry(key, data)} 
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                        {#if item.data.imageSrc}
                            <div class="h-full">
                                <div class="h-full">
                                    <p>here's a picture</p>
                                    <img class="object-contain h-full" src={item.data.imageSrc} alt="">

                                </div>
                            </div>
                        {/if}

                    </div>
                {/each}

            </div>
        {/if}
    {/each}
</div>

<style> 
    p-span, p, div {
        padding: 12px;
    }

    span {
        padding: 6px;
    }
</style>