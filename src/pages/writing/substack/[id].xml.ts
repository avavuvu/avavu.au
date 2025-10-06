import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import Markdoc from "@markdoc/markdoc"

export const getStaticPaths = async () => {
    const writing = await getCollection("writing");

    return writing.map(({id}) => ({
        params: { id },
    }));
}

export const GET: APIRoute = async ({site, params}) => {
    const { id } = params
    const post = await getEntry("writing", id!)!;

    let hero = ""
    if(post.data.heroImageSrc) {
        if(typeof post.data.heroImageSrc === "string") {
            hero = `![${post.data.heroImageAlt}](${post.data.heroImageSrc})`
        } else {
            hero = `![${post.data.heroImageAlt}](${post.data.heroImageSrc[0]})`
        }
    }

    const note = `*This is a mirror. This article was first published and is better read at [avavu.au](https://avavu.au/writing/${post.id})*`
    const article = `${hero}
    
    ${note}

    ${post.body!}`
    
    const ast = Markdoc.parse(article)

    const tree = Markdoc.transform(ast, {
        nodes: {
            ...Markdoc.nodes,
            image: {
                transform(node, config) {
                    const children = node.transformChildren(config);

                    const src = node.attributes["src"]
                    const staticSource = new URL(src, "https://avavu.au/" ).toString()

                    return new Markdoc.Tag(
                        "img",
                        {
                            src: staticSource
                        },
                        children
                    )
                },
            }
        },
        tags: {
            "note-content": {
                transform() {
                    return new Markdoc.Tag()
                }
            }
        }
    })
    
    const htmlString = Markdoc.renderers.html(tree)

    const item: RSSFeedItem = {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/writing/${post.id}/`,
        content: htmlString,
        categories: post.data.tags,
        
    }
    
    return rss({
        title: "Substack import",
        description: "This is an automated endpoint for the purpose of making importing on to substack easier. If you are reading this you must be very clever. Or you are literally me.",
        site: site!,
        items: [item]
    })
}
