<script lang="ts">
    import type { CollectionEntry } from "astro:content";
  import convertToUrl from "../../lib/util/convertToUrl";
  import { formatDate } from "src/lib/util/date";

    const { pieces }: {
        pieces: CollectionEntry<"writing">[]
    } = $props()

    const sorted = pieces.sort((a, b) => {
        return b.data.date.getTime() - a.data.date.getTime()
    })


</script>

<div class="mx-auto max-w-[400px] px-4 my-16 ">
    <h1 class=" scale-x-75 text-4xl text-center">Writing Archive</h1>

    <div class="">
        {#each sorted as {id, data}}
            <div class="py-2 ">
                <a class=" w-full" href="/writing/{convertToUrl(data.title)}">
                    <div class="flex justify-between align-middle items-center">
                        <h1 class="underline">{data.title}</h1>
                        <p class="text-right">{formatDate(data.date)}</p>

                    </div>
                </a>
            </div>
        {/each}
    
    </div>
</div>

<style>

</style>