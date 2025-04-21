<script lang="ts">
    import { animate, scroll } from "motion";
    import mosaicData from "../assets/mosaic/data.json"
    import { sineInOut } from "svelte/easing";

    console.log(JSON.stringify({
        width: mosaicData.width,
        height: mosaicData.height,
        data: mosaicData.data.map(bool => bool ? 1 : 0)
    }))

    let posterSection!: HTMLElement;
    let posterList!: HTMLUListElement
    let progress = $state(0);

    
    interface Poster {
        type: "Poster"
        src: string,
        title: string
    }

    interface Info {
        type: "Info",
        html: string
    }

    type Display = Info | Poster;

    const posters: Display[] = [
        {
            type: "Poster",
            src: "assets/posters/0.webp",
            title: "100 Gecs in Melbourne",
        },
        {
            type: "Poster",
            src: "assets/posters/1.webp",
            title: "RMIT End of Year Party",
        },
        {
            type: "Info", //should probs be a snippet
            html: ` 
                <div class="text-center">
                    <p>Want your own?</p>
                    <a class="underline text-[blue]" href="/services">Pay me money</a>
                </div>
                `
        },
        {
            type: "Poster",
            src: "assets/posters/2.webp",
            title: "Friday Blender Meetup",
        },
        {
            type: "Poster",
            src: "assets/posters/3.webp",
            title: "Astroboy Party Poster",
        },
        {
            type: "Poster",
            src: "assets/posters/4.webp",
            title: "PSC Grad Show (unused)",
        },
    ];

    let cancelScroll: VoidFunction = () => {}

    const setScrollAnimation = () => {
        cancelScroll()

        cancelScroll = scroll(
            animate(
                posterList,
                {
                    transform: [
                        "none",
                        `translateX(-${posters.length - 1}00vw)`,
                    ],
                },
                { ease: "linear" }
            ),
            { target: posterSection }
        )
    }

    $effect(() => {
        setScrollAnimation()

        scroll((value: number) => (progress = value), {
            target: posterSection
        })
    })
</script>

<svelte:window onresize={setScrollAnimation} />


<div>
    <div class="sticky top-0 pointer-events-none">
        <svg viewBox={`0 0 ${mosaicData.width} ${mosaicData.height}`}>
            {#each mosaicData.data as value, index}
                {@const dataPoint = value === 1}
                {@const x = index % mosaicData.width}
                {@const y = Math.floor(index / mosaicData.width)}
                {@const noise = Math.random()}

                <circle
                    r={0.5}
                    cx={x + 0.5}
                    cy={y + 0.5}
                    fill={dataPoint || noise < sineInOut(progress)
                        ? "transparent"
                        : "blue"}
                />
            {/each}
        </svg>
    </div>
    
    <section
        bind:this={posterSection}
        style:height={`${posters.length}00vh`}
        class={`relative overflow-x-clip`}>

        <ul bind:this={posterList} class="flex sticky top-0">
            {#each posters as poster}
                <li
                    class="h-screen w-screen flex-shrink-0 overflow-hidden flex items-center justify-center flex-col"
                >
                    {#if poster.type === "Poster"}
                        <img class="w-[400px]" loading="lazy" src={poster.src} alt="a" />
                    {:else}
                        <div class="py-10 px-4 border-2 border-black bg-white">
                            {@html poster.html}

                        </div>
                    {/if}
                </li>
            {/each}
        </ul>
        <div class="absolute inset-0 pointer-events-none">
            {#each posters as poster, index}
                <div class=" h-screen w-screen flex items-end gap-10">
                    <div class="w-full">
                        <span class="ml-2 text-5xl">#{index + 1}</span>
                        <span>{poster.type === "Poster" ? poster.title : ""}</span>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>

</style>
