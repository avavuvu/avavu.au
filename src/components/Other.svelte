<script lang="ts">
    import { slide } from "svelte/transition";

    const selections = ["none", "music"] as const
    type Selection = typeof selections[number]

    let selection: Selection = $state("none")
</script>

<div>
    <button onclick={() => selection = "music"}>
        <h2>Music</h2>
    </button>
    {#if selection === "music"}
        <div transition:slide>
            Music
            <ul>
                Life In Jars
            </ul>
            <ul>
                How to Look Forward to the Apocalypse
            </ul>
            <ul>
                Between Me & You
            </ul>
        </div>
    
    {/if}
    </div>