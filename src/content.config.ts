import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { projectCollections } from './projects.config';

const webdesign = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/collections/webdesign" }),
    schema: z.object({
        title: z.string(),
        date: z.date()
      })
});

const writing = defineCollection({
    loader: glob({ pattern: "**/*.mdoc", base: "./src/collections/writing" }),
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
        tags: z.array(z.string()).optional()
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

export const collections = { 
    ...projectCollections,
    newsletter,
    webdesign,
    writing
}
