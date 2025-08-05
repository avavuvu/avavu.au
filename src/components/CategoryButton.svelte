<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import convertToUrl from "../lib/util/convertToUrl";

    const { children, category, categoryDisplay, currentCategory }: { 
        children: Snippet,
        category: string, 
        categoryDisplay: string,
        currentCategory: string
    } = $props()


</script>

<div
    class:selected={currentCategory === category}>
    <a 
        data-spa
        href="/projects/{category}"
        class="block w-full h-full text-left">
        <svg viewBox="0 0 100 14" class="border-2">
            <text x="0" y="12" fill="black" class="transition-all"  >
                {categoryDisplay}
            </text>
        </svg>
    </a>
    {@render children()}
</div>

<style>
    button {
        cursor: pointer;
    }
</style>

