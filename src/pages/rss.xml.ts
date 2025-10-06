import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Markdoc from "@markdoc/markdoc"

export const GET: APIRoute = async (context) => {
    const writing = await getCollection("writing");
    
    return rss({
        title: "Ava's Writing",
        description: "The things I think about",
        site: context.site!,
        items: writing.map((post) => {
            const ast = Markdoc.parse(post.body!)
            const htmlString = Markdoc.renderers.html(Markdoc.transform(ast))

            return {
                title: post.data.title,
                pubDate: post.data.date,
                description: post.data.description,
                link: `/writing/${post.id}/`,
                content: htmlString
            }
        }),
    })
}