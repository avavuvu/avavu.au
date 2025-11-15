import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { projectCollections } from './projects.config';
import convertToUrl from './lib/util/convertToUrl';

const webdesign = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/collections/webdesign" }),
    schema: z.object({
        title: z.string(),
        date: z.date()
      })
});

const writing = defineCollection({
    loader: glob({ 
        pattern: "**/*.mdoc", 
        base: "./src/collections/writing",
        generateId: (options) => {
            return convertToUrl(
                (options.data as any).title
            )
        }
     }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        author: z.string().default("Ava Vu"),
        heroImageSrc: z.string().or(z.array(z.string())),
        heroImageAlt: z.string(),
        description: z.string(),
        links: z.array(z.object({
            title: z.string(),
            url: z.string().url(),
            pub: z.string()
        })).optional(),
        tags: z.array(z.string()).optional(),
        bsky: z.object({
            did: z.string(),
            postCid: z.string(),
        }).optional()
    })
})

const newsletter = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/collections/newsletter" }),
    schema: z.object({
        subject: z.string(),
        preheader: z.string(),
        date: z.date(),
        crosswords: z.array(
            z.object({
                info: z.string(),
                vendor: z.string(),
                link: z.string().url(),
                date: z.date(),
            })
        ).optional(),
        cool: z.array(
            z.object({
                title: z.string(),
                info: z.string(),
                links: z.array(z.string().url())
            })
        ).optional(),
        music: z.array(
            z.object({
                title: z.string(),
                info: z.string(),
                link: z.string().url()
            })
        ).optional()
    })
})

const now = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/now" }),
    schema: z.object({
        now: z.string(),
        message: z.string().optional(),
        song: z.string().optional(),
        word: z.object({
            word: z.string(),
            part: z.string(),
            desc: z.string(),
            link: z.string().url(),
            toMe: z.string(),
            markdown: z.string(),
        }),
        image: z.array(
            z.string()
        ).optional(),
        newsletter: z.object({
            random: z.array(z.string()),
            link: z.string(),
            title: z.string(),
        }).optional(),
        essay: z.object({
            image: z.string(),
            link: z.string(),
            title: z.string(),
        }).optional(),
        project: z.object({
            image: z.string(),
            link: z.string(),
            date: z.date(),
            title: z.string(),
        }).optional(),
        age: z.object({
            years: z.string(),
            seconds: z.string(),
            })
        }),
    })


export const collections = { 
    ...projectCollections,
    newsletter,
    webdesign,
    writing,
    now
}
