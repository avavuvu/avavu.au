<script lang="ts">
    import type { Snippet } from "svelte";
    import { currentCategory } from "../lib/projectStore"

    const { children, category }: { 
        children: Snippet,
        category: string, 
    } = $props()

    const selectCategory = (category: string) => {
        currentCategory.set(category)
    }

</script>

<div
    class:selected={$currentCategory === category}>
    <button 
        id={category}
        onclick={() => selectCategory(category)}
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

