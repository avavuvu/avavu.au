<script lang="ts">
    import type { InferEntrySchema, DataEntryMap } from "astro:content";
    import { slide } from "svelte/transition";
    
    type Project = InferEntrySchema<keyof DataEntryMap>

    const { allProjects, path }: {
        allProjects: Record<string,{
            data: Project,
            id: string,
            collection: string
        }[]>,
        path?: string
    } = $props()


    const removedKeys = ["imageSrc", "title", "date", "links", "flag", "rating", "collaborators", "youtubeId"]

    function hasLinks(data: Project): data is Project & { links: object } {
        return 'links' in data;
    }

    function hasCollaborators(data: Project): data is Project & { collaborators: object } {
        return 'collaborators' in data;
    }


    const getRelevantData = (data: Project) => {
        return Object.entries(data).filter(([key, value]) => 
            !removedKeys.includes(key)
        )
    }

    let yearSelected: string = $state("")
    let entrySelected: string = $state("")
    
    let currentProject: Project | null = $state(null)

    const selectYear = (year: string) => {
        yearSelected = year
        currentProject = allProjects[year][0].data
        entrySelected = allProjects[year][0].id
    }

    const selectEntry = (id: string) => {
        entrySelected = id
        currentProject = allProjects[yearSelected]
            .find((project) => project.id === id)?.data ?? null

        document.getElementById(yearSelected)?.scrollIntoView({
            behavior: "smooth"
        })
    }
</script>

<div class="border-2 font-bold overflow-hidden">
    <a 
        href="/"
        class="block scale-x-[500%] text-center" >
        RETURN HOME
    </a>
</div>
<div class="border-2 font-bold">
    <div
        class="w-full scale-x-[100%] text-center flex justify-center gap-2 p-2">
        <span>SORT BY:</span>
        <a 
            class="[.path]:border-b [.path]:border-black"
            class:path={!path || path === "year"}
            href="/projects/year"
            >
            YEAR
        </a>
        <a 
            class="[.path]:border-b [.path]:border-black"
            class:path={path === "type"}
            href="/projects/type">
            TYPE
        </a>
        <a
            class="[.path]:border-b [.path]:border-black"
            class:path={path === "rating"}
            href="/projects/rating">
            HOW MUCH I LIKE IT
        </a>
    </div>
</div>

{#snippet image()}
    <div class="overflow-scroll h-full w-full flex-col flex gap-4 p-4">
        {#if currentProject?.imageSrc}
            {#if typeof currentProject.imageSrc === "string"}
                <img src={currentProject.imageSrc} alt="">
            {:else}
                {#each currentProject.imageSrc as src}
                    <img {src} alt="">
                {/each}
            {/if}
        {/if}
        {#if currentProject && "youtubeId" in currentProject}
            <iframe width="560" height="315" src="https://www.youtube.com/embed/{currentProject.youtubeId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        {/if}
    </div>
{/snippet}

{#each !path || path === "year" ? Object.entries(allProjects).toReversed() : Object.entries(allProjects) as [year, entries]}
    <div class:selected={year === yearSelected}>
        <button 
            id={year}
            onclick={(event) => selectYear(year)}
            class="block w-full h-full text-left">
            <svg viewBox="0 0 100 14" class="border-2">
                <text x="0" y="12" fill="black" class="transition-all"  >
                    {year}
                </text>
            </svg>
        </button>
        {#if true || yearSelected === year}
            <div transition:slide class="projects grid-cols-1 lg:grid-cols-2 grid h-[75vh] lg:h-[90vh] overflow-scroll">
                <div>
                    {#each entries as {id, collection, data}}
                        <div class="px-2 pb-8">
                            <button 
                                class="
                                    group
                                    grid-cols-[5rem_3fr_auto]
                                    grid lg:grid-cols-[10rem_3fr_auto]
                                    
                                    w-full text-left
                                    border-b border-y-transparent hover:border-b-black [.se]:border-b-black"
                                onclick={() => {
                                    selectEntry(id)
                                }}
                                class:se={id === entrySelected}>
                                <span>{data.date.getFullYear()}/{data.date.getMonth() + 1}/{data.date.getDate()}</span>
                                <span class="group-[.se]:font-bold">{data.title}</span>
                                <span class="text-right">{collection}</span>
                                {#if data.flag}
                                    <span class="col-span-3 text-right">{data.flag}</span>
                                {/if}
                            </button>
                            {#if id === entrySelected}
                                <div 
                                    transition:slide
                                    class="
                                        lg:ml-[10rem] grid-cols-[5rem_1fr]  lg:grid-cols-[auto_1fr]  gap-x-4 grid">
                                    {#each getRelevantData(data) as [key, value]}
                                        <span>{key}</span>
                                        <span>{value}</span>
                                    {/each}
                                    {#if hasLinks(data)}
                                        <span>links</span>
                                        <div>
                                            {#each Object.entries(data.links) as [link, href]}
                                                <a class="block underline text-blue" {href}>
                                                    {link}
                                                </a>  
                                            {/each}
                                        </div>
                                    {/if}
                                    {#if hasCollaborators(data)}
                                        <span>collaborators</span>
                                        <div>
                                            {#each Object.entries(data.collaborators) as [, href]}
                                                <svelte:element this={href.url ? "a" : "div"} 
                                                    class:link={href.url}
                                                    class="block" href={href.url ?? ""}>
                                                    {href.name}
                                                </svelte:element>  
                                            {/each}
                                        </div>
                                    {/if}
                                    <div class="block lg:hidden col-span-2">
                                        {@render image()}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
                <div class="hidden lg:block">
                    {@render image()}
                </div>
            </div>
        {/if}

    </div>

{/each}

<style>


    button {
        cursor: pointer;
    }

    .selected text {
        transform: scaleX(300%);
        transition-duration: 1000ms;
    }

    .projects {
        max-height: 0px;
        transition: max-height 0.5s ease-in-out;
    }

    .selected .projects {
        max-height: 80vh;
    }

    .content {
        max-height: 0;
        transition: all;
        transition-duration: 100ms;
    }

    .selected .content {
        max-height: 500px;
        
    }
</style>