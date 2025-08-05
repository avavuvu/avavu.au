<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { currentCategory, currentEntry } from "../lib/projectStore";
  import type {
    Project,
    ProjectCollectionData,
    ProjectMetadata,
  } from "../lib/types";
  import convertToUrl from "../lib/util/convertToUrl";
  import ProjectDisplay from "./projects/ProjectDisplay.svelte";

  const {
    category,
    currentProject,
    metadata,
    promise,
    id,
  }: {
    category: string;
    currentProject: string;
    metadata: ProjectMetadata;
    promise: Promise<Project> | undefined;
    id: string;
  } = $props();

  const date = new Date(metadata.date);

  const removedKeys = [
    "imageSrc",
    "title",
    "date",
    "links",
    "flag",
    "rating",
    "collaborators",
    "youtubeId",
  ];
  const getRelevantData = (data: Project) => {
    return Object.entries(data).filter(
      ([key, value]) => !removedKeys.includes(key)
    );
  };

  function hasLinks(data: Project): data is Project & { links: object } {
    return "links" in data;
  }

  function hasCollaborators(
    data: Project
  ): data is Project & { collaborators: object } {
    return "collaborators" in data;
  }
</script>

<div class:selected-entry={id === currentProject} class="px-2 pb-8 group entry">
  <a
    data-spa
    href="/projects/{category}/{id}"
    class="
            group
            w-full text-left
            border-b border-y-transparent hover:border-b-black group-[.selected-entry]:border-b-black"
  >
    <div
      class="           
            grid-cols-[6rem_3fr_auto]
            grid lg:grid-cols-[10rem_3fr_auto]"
    >
      <span>
        {date.getFullYear()}/{(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/{date.getDate().toString().padStart(2, "0")}
      </span>

      <span class="group-[.selected-entry]:font-bold">
        {metadata.title}
      </span>

      <span class="text-right">
        {metadata.collection}
      </span>

      <!-- {#if data.flag}
                <span class="col-span-3 text-right">{data.flag}</span>
            {/if} -->
    </div>
  </a>
  <div class="entry-content">
    <div
      class="overflow-scroll
            lg:ml-[10rem] grid-cols-[5rem_1fr] lg:grid-cols-[auto_1fr] gap-x-4 grid"
    >
      {#if promise}
        {#await promise}
          <span class="w-full text-center col-span-3">loading...</span>
        {:then project} 
          {#each getRelevantData(project) as [key, value]}
            <span>{key}</span>
            <span>{value}</span>
          {/each}
          {#if hasLinks(project)}
            <span>links</span>
            <div>
              {#each Object.entries(project.links) as [link, href]}
                <a class="block underline text-blue" {href}>
                  {link}
                </a>
              {/each}
            </div>
          {/if}
          {#if hasCollaborators(project)}
            <span>collaborators</span>
            <ul>
              {#each Object.entries(project.collaborators) as [, href]}
                <li>
                  {#if href.url}
                    <a
                      class:list={{ link: href.url }}
                      class="block link"
                      href={href.url ?? ""}
                    >
                      {href.name}
                    </a>
                  {:else}
                    <div>
                      {href.name}
                    </div>
                  {/if}

                </li>
              {/each}

            </ul>
          {/if}
          <div class="block lg:hidden col-span-2">
            <ProjectDisplay {project}></ProjectDisplay>
          </div>
        {/await}
      {/if}

    </div>
  </div>
</div>
