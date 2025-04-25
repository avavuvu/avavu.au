<script lang="ts">
    import StaticDisplay from "./StaticDisplay.svelte";
    import { currentCategory, currentEntry } from "../lib/projectStore";

    const { allProjects } = $props()

    let project = $derived(
        $currentCategory in allProjects 
            ? allProjects[$currentCategory]
                .find((project: any) => project.id === $currentEntry)?.data ?? null
            : null
    )
</script>


<StaticDisplay {project}></StaticDisplay>
