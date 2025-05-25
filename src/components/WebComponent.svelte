<script lang="ts">

    const { projects }: { 
        projects: {[key: string]: string} 
    } = $props()

    type BoxDisplay = ({
        type: "char",
        char: string,
        scale?: number
    } | {
        type: "url",
        image: string,
        backgroundColor: string,
        title: string,
        url: string,
        hash: string,
    } | {
        type: "text",
        backgroundColor: string,
        text: string,
    })

    const box: BoxDisplay[] = [
        {
            type: "char",
            char: "W"
        },
        {
            type: "char",
            char: "E"
        },
        {
            type: "char",
            char: "B"
        },
        {
            type: "url",
            image: "/images/interactive/radiofodder1.png",
            url: "https://radiofodder.live",
            backgroundColor: "#f44971",
            title: "Radio Fodder Live",
            hash: "radiofodder",
        },
        {
            type: "char",
            char: "D"
        },
        {
            type: "url",
            image: "/images/interactive/rmitgrad1.png",
            backgroundColor: "#f7b50e",
            title: "RMIT Grad Show 2024",
            url: "https://2024.rmitdigitalmedia.com/",
            hash: "rmitgrad",
        },
        {
            type: "char",
            char: "E"
        },
        {
            type: "url",
            image: "/images/interactive/crossworddotblue1.png",
            backgroundColor: "#0e73f7",
            title: "Crossword Dot Blue",
            url: "https://crossword.blue",
            hash: "crossworddotblue",
        },
        {
            type: "char",
            char: "S"
        },
        {
            type: "url",
            image: "/images/interactive/suburble1.png",
            backgroundColor: "#32db65",
            title: "Suburble",
            url: "https://suburble.melbourne/",
            hash: "suburble",
        },
        {
            type: "char",
            char: "I"
        },

        {
            type: "char",
            char: "G"
        },
        {
            type: "char",
            char: "N"
        },
        {
            type: "text",
            text: "WANT YOUR OWN?",
            backgroundColor: "#0000ff"
        },
    ] as const

    const boxChunks = box.reduce((array, displayItem, index) => {
        const chunkIndex = Math.floor(index / 3);
    
        if (!array[chunkIndex]) {
            array[chunkIndex] = [];
        }
        
        array[chunkIndex].push(displayItem);
        return array;
    }, [] as BoxDisplay[][])

    const lastChunkLength = boxChunks.at(-1)!.length
    if(lastChunkLength < 3) {
        for (let i = 0; i < 3-lastChunkLength; i++) {
            boxChunks.at(-1)!.push({
                type: "char",
                char: "★"
            })
        }
    }

    const hash = window.location.hash

    let active = $state(hash
        ? box.findIndex(display => display.type === "url" && display.hash === hash.slice(1))
        : -1
    )

    const setActive = (index: number, display: BoxDisplay) => {

        active = index
        
        if(display.type === "url") {
            const hash = `#${display.hash}`
            window.location.hash = hash
        }

        box.forEach(box => {
            if(box.type !== "url") {
                return
            }
            
            document.querySelector(`#${box.hash} article`)!.scrollTo({ top: 0, })
        })

        window.scroll({
            top: document.querySelector(".active")?.clientTop
        })
    }
</script>

<div class="border-2 font-bold overflow-clip">
    <a 
        href="/"
        class="block scale-x-[500%] text-center">
        RETURN HOME
    </a>
</div>

<div id="" class="">
    {#each boxChunks as boxDisplays, chunkIndex}
        <div class="grid">
            {#each boxDisplays as boxDisplay, boxIndex}
                {@const index = boxIndex + (chunkIndex * 3)}
                <button 
                    onclick={() => setActive(index, boxDisplay)}
                    class:active={index === active}
                    class:center={boxIndex === 1}
                    class:left={boxIndex === 0}
                    class:right={boxIndex == 2}
                    class="overflow-clip border-2 min-w-0 cursor-pointer"
                    class:char={boxDisplay.type === "char"}
                    class:url={boxDisplay.type === "url"}>
                    
                    {#if boxDisplay.type === "char"}
                        <div class="p-1 lg:p-2" >
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                <text 
                                    font-family="Helvetica"
                                    class=""
                                    transform-origin="center"
                                    x="50%" 
                                    y={`${50 + index % 7 % 6 % 2 * 20}%`} 
                                    dominant-baseline="middle" 
                                    text-anchor="middle"
                                    font-size="{boxDisplay.scale ? boxDisplay.scale : 155}" 
                                    fill="currentColor"
                                    font-weight="bold">
                                    {boxDisplay.char}
                                    </text>
                            </svg>

                        </div>
                    {:else if boxDisplay.type === "url"}
                        <div 
                            id={boxDisplay.hash}
                            style:background-color={boxDisplay.backgroundColor}
                            class="flex justify-center items-center align-middle h-full p-2 lg:p-4">
                            <article 
                                class:active={index === active}
                                class="overflow-scroll">
                                <div>
                                    <img
                                        class="max-w-[min(90vw,100%)] lg:max-w-[min(60vw,100%)] mx-auto"
                                        alt=""  
                                        src={boxDisplay.image}>
                                    <div class="article-content bg-white max-w-[min(90vw,100%)] lg:max-w-[min(60vw,100%)] mx-auto ">
                                        <a class="underline" href={boxDisplay.url}>
                                            <h1 class="text-2xl lg:text-7xl font-serif scale-y-150 origin-center py-4">
                                                {boxDisplay.title}
                                            </h1>
                                        </a>

                                        <p class="text-box px-4 pb-4 text-left max-w-[65ch] mx-auto">
                                            {@html projects[boxDisplay.hash]}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    {:else if boxDisplay.type === "text"}
                        <div 
                        style:background-color={boxDisplay.backgroundColor}
                        class="flex justify-center items-center align-middle h-full p-2 lg:p-4">
                        <article 
                            class:active={index === active}
                            class="overflow-scroll">
                            <div>
                                <div class="bg-white py-2">
                                    <h1 class="text-sm lg:text-7xl font-serif scale-y-150 origin-center py-2 lg:py-4">
                                        {boxDisplay.text}
                                    </h1>
                                </div>
                                <div class="article-content bg-white max-w-[min(90vw,100%)] lg:max-w-[min(60vw,100%)] mx-auto min-h-[200px] flex flex-col justify-center place-items-center ">
                                    <p class="px-4  text-left max-w-[65ch] mx-auto">
                                        I am able open to making websites, portfolios, e-commerce sites, posters, and more. Send me a message at <a class="link" href="mailto:avadinhvu@gmailcom">my email</a> or <a class="link" href="https://instagram.com/avavu.au">my instagram</a>
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                    {/if}
                </button>
                {/each}
        </div>
        
    {/each}
    <!-- <img src="/web/radiofodder1.png">
    <img src="/web/radiofodder2.png"> -->
</div>

<style>
    svg {
    shape-rendering: crispEdges; /* or geometricPrecision */
    -webkit-transform: translateZ(0); /* Force hardware acceleration */
    backface-visibility: hidden;
    display: block;
    transform-box: fill-box; 
    }

    article {
        aspect-ratio: 16 / 9;
        overflow: hidden;
    }

    article.active {
        overflow-y: scroll;
        cursor: default;
    }

    :global(.text-box img) {
        margin: 4rem 0;
        border: 1px solid black;
        
    }

    :global(.text-box a) {
        color: blue;
        text-decoration: underline;
        
    }
    :global(.text-box p) {
        padding: .5rem 0;
        
    }

    @media only screen and (max-width: 1000px) {
        article {
            transition: aspect-ratio;
            transition-duration: 500ms;
        }

        article.active {
            aspect-ratio: 1;
            
        }

    }

    .article-content {
        opacity: 0;
        visibility:hidden;
    }

    article.active .article-content {
        visibility: visible;
        opacity: 100%;
        transition: opacity;
        transition-duration: 300ms;
        transition-delay: 500ms;
    }

    .grid {
        transition: all;
        transition: 500ms;
    }

    .left, .center, .right {
        transition: 500ms;
        transition: all;
        transform: translateZ(0);
    }

    .grid {
        grid-template-columns: 1fr 1fr 1fr;
        min-height: 0;
    }

    .grid:has(.left.active) {
        grid-template-columns: 2fr 0.05fr 0.05fr;
        min-height: 400px;
    }

    .grid:has(.center.active) {
        grid-template-columns: 0.05fr 2fr 0.05fr;
        min-height: 400px;
    }
    .grid:has(.right.active) {
        grid-template-columns: 0.05fr 0.05fr 2fr;
        min-height: 400px;
    }
</style>