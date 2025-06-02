<script lang="ts">
    const { project }: {project: any | null} = $props()

</script>

<div class="overflow-scroll h-full w-full flex-col flex gap-4 p-4">
    {#if project}
    {#if project?.imageSrc}
        {#if typeof project.imageSrc === "string"}
            <img src={project.imageSrc} alt="">
        {:else}
            {#each project.imageSrc as src}
                <img {src} alt="">
            {/each}
        {/if}
    {/if}
    {#if project && "youtubeId" in project}
        <div>
            
            <iframe class="aspect-video w-full" width="560" height="315" src="https://www.youtube.com/embed/{project.youtubeId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
    {/if}
    {/if}
</div>