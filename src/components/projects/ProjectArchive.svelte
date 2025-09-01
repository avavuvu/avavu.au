<script lang="ts">
  import type { ProjectCollectionData, ProjectData, ProjectMetadata } from "@t/*";
    import  { createBrowserHistory}  from "history";
  import convertToUrl from "../../lib/util/convertToUrl";
  import { SvelteMap } from "svelte/reactivity";
  import CategoryButton from "../CategoryButton.svelte";
  import ProjectDisplay from "./ProjectDisplay.svelte";
  import EntryButton from "../EntryButton.svelte";
  import { onMount } from "svelte";
  import type { SortKey } from "../../pages/api/projects/[sort]";

    const { projects, sort, prerendered }: {
        projects: [string, ProjectMetadata[]][],
        sort: SortKey | null,
        prerendered?: {
            category: string,
            project?: string
        }
    } = $props()
    
    $effect(() => {
        const browserHistory = createBrowserHistory()
    
        browserHistory.listen(async (event) => {
            setProjectFromLocation(event.location.pathname)
        })

        document.querySelectorAll("[data-spa]").forEach(element => {
            const anchor = element as HTMLAnchorElement
            anchor.addEventListener("click", (event) => {
                event.preventDefault()

                browserHistory.push({
                    pathname: anchor.href,
                    search: sort ? `?sort=${sort}` : ""
                })
            })
        })

        setProjectFromLocation(window.location.pathname)

    
        // onMount(() => {
        //     setProjectFromLocation(window.location.pathname)
    
        //     const target = currentProject || currentCategory
    
        //     // document.querySelector(`#category-${target}`)!.scrollIntoView({
        //     //     "block": "end"
        //     // })
        // })
    })

    const setProjectFromLocation = (location: string) => {
        const [ _, _project, category, title] = location.split("/")

        if(title) {
            currentProject = title

            loadedProjects.set(
                title, 
                loadProjectData(title)
            )
        } else {
            currentProject = ""
        }

        if(category) {
            currentCategory = mapCategoryName(category)
        }

    }

    const loadProjectData = async (title: string) => {
       const response = await fetch(`/api/projects/${title}`)
       const json = await response.json()

       const data = json.data

       document.title = `${data.title} – Ava Vu`
       return data
    }

    const mapCategoryName = (categoryName: string) => {
        const starsCount = (categoryName.match(/★/g) || []).length;

        if(starsCount > 0) {
            return `rating-${starsCount}`
        }

        if(/^\d/.test(categoryName)) {
            return `year-${categoryName}`
        }

        return categoryName
    }


    const loadedProjects = new SvelteMap<string, Promise<ProjectCollectionData>>()
    let currentCategory = $state("")
    let currentProject = $state("")

    if(prerendered) {
        currentCategory = prerendered.category

        if(prerendered.project) {
            currentProject = prerendered.project
        }
    }

</script>

<ul>
    {#each projects as [category, projectMetadatas]}
        <li id="category-{category}">
            <CategoryButton category={mapCategoryName(category)} categoryDisplay={category} {currentCategory}>
                <div class="projects grid-cols-1 lg:grid-cols-2 grid h-[75vh] lg:h-[90vh] overflow-scroll">
                    <ul>
                        {#each projectMetadatas as metadata}
                            {@const id = convertToUrl(metadata.title)}
                            <li {id}>
                                <EntryButton category={mapCategoryName(category)} {id} {metadata} {currentProject} promise={loadedProjects.get(id)}>

                                </EntryButton>
                            </li>
                        {/each}
                    </ul>
                    <div class="overflow-y-scroll">
                        {#if loadedProjects.get(currentProject)}
                            {#await loadedProjects.get(currentProject)}
                                <div class="w-full text-center pt-24">loading...</div>
                            {:then project}
                                <ProjectDisplay {project}></ProjectDisplay>
                                
                            {/await}
                        {/if}
                    </div>
                </div>
            </CategoryButton>

        </li>
    {/each}

</ul>