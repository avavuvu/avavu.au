<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import convertToUrl from "src/lib/util/convertToUrl";

    const { pieces }: {
        pieces: CollectionEntry<"writing">[]
    } = $props()

    const formatDate = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`

</script>

<div class="mx-auto max-w-[400px] px-4 my-16 text-blue font-sans">
    <h1 class="font-serif scale-x-75 text-4xl text-center">Writing Archive</h1>

    <ul class="">
        {#each pieces as {id, data}}
            <li class="py-2 ">
                <a class=" w-full" href="/writing/{convertToUrl(data.title)}">
                    <div class="flex justify-between">
                        <h1>{data.title}</h1>
                        <p class="text-right">{formatDate(data.date)}</p>

                    </div>
                </a>
            </li>
        {/each}
    
    </ul>
</div>

<style>

</style>