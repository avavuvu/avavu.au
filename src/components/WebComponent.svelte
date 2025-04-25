<script lang="ts">

    type BoxDisplay = ({
        type: "char",
        char: string,
        scale?: number
    } | {
        type: "link",
        image: string,
        backgroundColor: string,
        title: string,
        link: string,
        hash: string,
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
            type: "link",
            image: "/web/radiofodder2.png",
            link: "https://radiofodder.live",
            backgroundColor: "#f44971",
            title: "Radio Fodder Live",
            hash: "radiofodder"
        },
        {
            type: "char",
            char: "D"
        },
        {
            type: "link",
            image: "/web/rmitgrad1.png",
            backgroundColor: "#f7b50e",
            title: "RMIT Grad Show 2024",
            link: "https://2024.rmitdigitalmedia.com/",
            hash: "rmitgrad"
        },
        {
            type: "char",
            char: "E"
        },
        {
            type: "link",
            image: "/web/crossworddotblue1.png",
            backgroundColor: "#0e73f7",
            title: "Crossword Dot Blue",
            link: "https://crossword.blue",
            hash: "crossworddotblue"
        },
        {
            type: "char",
            char: "S"
        },
        {
            type: "link",
            image: "/web/suburble1.png",
            backgroundColor: "#32db65",
            title: "Suburble",
            link: "https://suburble-304e2.web.app/",
            hash: "suburble"
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
            type: "char",
            char: "E"
        },
        {
            type: "char",
            char: "R"
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

    const hash = window.location.hash
    console.log(hash)

    let active = $state(hash
        ? box.findIndex(display => display.type === "link" && display.hash === hash.slice(1))
        : -1
    )
    const setActive = (index: number, display: BoxDisplay) => {

        active = index
        
        if(display.type === "link") {
            const hash = `#${display.hash}`
            window.location.hash = hash
        }

        box.forEach(box => {
            if(box.type !== "link") {
                return
            }
            document.querySelector(`#${box.hash} article`)!.scrollTo({ top: 0 })
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
                    class:link={boxDisplay.type === "link"}>
                    
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
                    {:else if boxDisplay.type === "link"}
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
                                        <a class="underline" href={boxDisplay.link}>
                                            <h1 class="text-2xl lg:text-7xl font-serif scale-y-150 origin-center py-4">
                                                {boxDisplay.title}
                                            </h1>
                                        </a>

                                        <p class="px-4 text-left max-w-[65ch] mx-auto">


                                            Molestias magni qui voluptatem. Hic optio eos aut sed excepturi distinctio sunt quidem. Non consequatur fugiat quasi dolorem labore voluptatem dolor. Similique voluptatem dolor consequatur esse tempore quia praesentium accusamus.
                                            
                                            Voluptates quia ab corporis asperiores. Voluptatem cupiditate unde et reprehenderit consequatur et dignissimos ea. Blanditiis quae id quod eveniet est facere atque ipsum. Quis et aliquam et occaecati veritatis.
                                            
                                            Minima qui saepe inventore et et. Voluptatem incidunt tenetur qui tenetur eum rem. Et veritatis facere voluptatibus similique porro et illum nisi. Eveniet dolor dignissimos dignissimos enim.
                                            
                                            Veritatis culpa praesentium ea nihil voluptatem et voluptatem cupiditate. Voluptas asperiores modi numquam rem eos et. Velit laborum nobis exercitationem eum ratione. Error voluptatum nesciunt et eum ex sint. Nemo voluptates rerum labore saepe esse odio asperiores. Blanditiis et quas voluptas.
                                            
                                            Voluptatem animi voluptatem et sed quis a. Tempore sint ut facilis officiis. Possimus laboriosam dolor ratione veritatis. Sunt officiis saepe id perferendis. Adipisci blanditiis aut voluptas odio nemo maiores vitae iure. Nihil dicta soluta maxime eum voluptas quos.
                                            
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

    .grid:has(.left.active.link) {
        grid-template-columns: 2fr 0.05fr 0.05fr;
        min-height: 400px;
    }

    .grid:has(.center.active.link) {
        grid-template-columns: 0.05fr 2fr 0.05fr;
        min-height: 400px;
    }
    .grid:has(.right.active.link) {
        grid-template-columns: 0.05fr 0.05fr 2fr;
        min-height: 400px;
    }
</style>