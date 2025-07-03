<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { currentCategory } from "../lib/projectStore"
  import convertToUrl from "../lib/util/convertToUrl";

    const { children, category }: { 
        children: Snippet,
        category: string, 
    } = $props()

    onMount(() => {
        let [hashCategory,_] = window.location.hash.split("&&")
        hashCategory = hashCategory.slice(1)

        if(hashCategory === convertToUrl(category)) {
            selectCategory()
        }
    })

    const selectCategory = () => {
        currentCategory.set(category)
    }

</script>

<div
    class:selected={$currentCategory === category}>
    <button 
        id={category}
        onclick={() => selectCategory()}
        class="block w-full h-full text-left">
        <svg viewBox="0 0 100 14" class="border-2">
            <text x="0" y="12" fill="black" class="transition-all"  >
                {category}
            </text>
        </svg>
    </button>
    {@render children()}
</div>

<style>
    button {
        cursor: pointer;
    }
</style>

