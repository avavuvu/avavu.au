<script lang="ts">
    import type { CollectionEntry } from "astro:content";
  import convertToUrl from "../../lib/util/convertToUrl";
  import { formatDate } from "src/lib/util/date";
  import Markdoc, { type Node } from "@markdoc/markdoc";
  import { standardMarkdocConfig } from "markdoc.config";

    const { pieces }: {
        pieces: CollectionEntry<"writing">[]
    } = $props()

    const tokenizer = new Markdoc.Tokenizer({
        typographer: true,
    });

    const plainTextify = (ast: Node) => {
        const text = recurse(ast)

        return text.map(a => a.join(" ")).slice(1)
    }

    const recurse = (node: Node, output: string[][] = [[]]) => {
        if("content" in node.attributes) {
            output[output.length - 1].push(node.attributes["content"]);
        }

        if(node.type === "paragraph") {
            output.push([]);
        }
        
        if (node.children) {
            for (const child of node.children) {
                recurse(child, output);
            }
        }
        
        return output;
    }

    interface PiecePreview {
        text: string[],
        image: string,
        title: string,
        date: Date,
    }

    const sorted: PiecePreview[] = pieces.sort((a, b) => {
        return b.data.date.getTime() - a.data.date.getTime()
    }).map((piece) => {
        const ast = Markdoc.parse(tokenizer.tokenize(piece.body!))
        const text = plainTextify(ast)

        const heroImage = typeof piece.data.heroImageSrc === "string"
            ? piece.data.heroImageSrc
            : piece.data.heroImageSrc[0]

        return {
            title: piece.data.title,
            image: heroImage,
            text: text.slice(0,2),
            date: piece.data.date
        }
    })

    let subArray: PiecePreview[][] = [[], [], [], []]

    for (let index = 0; index < sorted.length; index++) {
        
        subArray[index % 4].push(sorted[index])
        
    }

</script>

<div class="px-4 my-16 ">
    <h1 class=" scale-x-75 text-4xl text-center">Writing Archive</h1>

    <div class="grid grid-cols-4">
        {#each subArray as sorted}
            <div class="py-2 grid ">
            {#each sorted as {text, title, image, date}}
                <div>
                    <img src={image} alt="">

                    <a class=" w-full" href="/writing/{convertToUrl(title)}">
                        <h1 class="text-2xl underline">{title}</h1>
                    </a>
                    <p class="text-right">{formatDate(date)}</p>

                    {@html text.join("<br><br>")}
                </div>
                {/each}
            </div>
        {/each}
    
    </div>
</div>

<style>

</style>