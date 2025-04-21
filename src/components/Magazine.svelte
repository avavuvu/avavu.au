<script lang="ts">

</script>

<div class="farrago-container bg-[#f6ff53] overflow-hidden">
    <div class="farrago-background bg-[#ff56c4]"></div>
    <div class="content flex text-white justify-end">
        <div class="card-container">
            <div class="card">
                <img
                    loading="lazy"
                    class="farrago-front"
                    src="/assets/farrago/6_cover/front.avif"
                    alt="Magazine front cover of farrago"
                />
                <img
                    loading="lazy"
                    class="farrago-back"
                    src="/assets/farrago/6_cover/back.avif"
                    alt="Magazine back cover of farrago"
                />
                <div></div>
            </div>
        </div>
    </div>
</div>

<div class="text-center max-w-[65ch] mx-auto px-2 py-10 flex flex-col gap-10">
    <p>
        <a class="underline text-blue"  href="https://farragomagazine.com/">Farrago</a> is the University of Melbourne's student magazine. I was asked to do the designs of the final two covers for 2024. It's also the oldest student publication in Australia, first published on 3 April 1925.
        "Farrago" means a hodgepodge of miscellanious things, and I wanted to capture that in my designs.
    </p>

    <p>
        Edition 5 (below) won the <a class="underline text-blue" href="https://en.wikipedia.org/wiki/Farrago_(magazine)#The_Fitzpatrick_Awards">Fitzpatrick Award</a> for best cover. It is a render of a 3D model made in Blender.
    </p>
    <p>
        Edition 6 (above) was the final edition for the year, and a send off for that year's team. The names of everyone who had worked on Farrago that year appeared on the back.
    </p>
</div>

<div class="farrago-container bg-black overflow-hidden">
    <div class="farrago-background bg-blue"></div>
    <div class="content flex text-white}">
        <div class="card-container">
            <div class="card">
                <img
                    loading="lazy"
                    class="farrago-front"
                    src="/assets/farrago/5_cover/front.avif"
                    alt="Magazine front cover of farrago"
                />
                <img
                    loading="lazy"
                    class="farrago-back"
                    src="/assets/farrago/5_cover/back.avif"
                    alt="Magazine back cover of farrago"
                />
                <div></div>
            </div>
            <h1>Edition 5 Cover</h1>
        </div>
    </div>
</div>


<style scoped>
    .farrago-container {
        position: relative;
        width: 100%;
        z-index: -12;
    }

    .farrago-background {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        mask-image: url("/assets/farrago/logo/logo.svg");
        mask-origin: view-box;
        mask-position: center;
        z-index: -10;
    }

    .card-container {
        width: 400px;
        aspect-ratio: 1 / 1.414;
        position: relative;
        perspective: 1000px;
    }

    .card {
        position: relative;
        will-change: transform;
        translate: 0;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        animation: spin 10s linear infinite;
    }

    .farrago-front,
    .farrago-back {
        max-width: 400px;
        width: 100%;
        height: 100%;
        position: absolute;
        backface-visibility: hidden;
    }

    .farrago-back {
        transform: rotateY(180deg);
    }

    @media (prefers-reduced-motion: reduce) {
        .card {
            /* Provide fallback for users who prefer reduced motion */
            animation: none;
        }
    }

    @keyframes spin {
        0% {
            transform: rotateY(0deg) rotateZ(10deg) rotateX(10deg);
        }
        100% {
            transform: rotateY(360deg) rotateZ(10deg) rotateX(10deg);
        }
    }
</style>
