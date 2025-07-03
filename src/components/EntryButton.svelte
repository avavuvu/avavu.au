<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { currentCategory, currentEntry } from "../lib/projectStore"
    import type { Project } from "../lib/types";
    import convertToUrl from "../lib/util/convertToUrl";

    const { collection, children, data, id }: { 
        children: Snippet
        collection: string, 
        data: Project,
        id: string
    } = $props()

    let buttonDiv!: HTMLDivElement

    onMount(() => {
        const [_,hashCollection] = window.location.hash.split("&&")

        if(hashCollection === convertToUrl(data.title)) {
            currentEntry.set(id)
        }

        if(id === $currentEntry) {
            buttonDiv.scrollIntoView()
        }
    })

    const selectEntry = () => {
        currentEntry.set(id)
        window.location.hash = `${convertToUrl(currentCategory.value)}&&${convertToUrl(data.title)}`
    }


</script>


<div 
    bind:this={buttonDiv}
    class:selected-entry={id === $currentEntry}
    class="px-2 pb-8 group entry">
    <button
        onclick={() => selectEntry()}
        class="
            group
            w-full text-left
            border-b border-y-transparent hover:border-b-black group-[.selected-entry]:border-b-black">
        
        <div class="           
            grid-cols-[6rem_3fr_auto]
            grid lg:grid-cols-[10rem_3fr_auto]">
            <span>
                {data.date.getFullYear()}/{(data.date.getMonth() + 1).toString().padStart(2, "0")}/{data.date.getDate().toString().padStart(2,"0")}
            </span>

            <span class="group-[.selected-entry]:font-bold">
                {data.title}
            </span>

            <span class="text-right">
                {collection}
            </span>

            {#if data.flag}
                <span class="col-span-3 text-right">{data.flag}</span>
            {/if}
        </div>
    </button>
    <div class="entry-content">
        {@render children()}

    </div>
</div>
