import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { projectCollections } from './projects.config';

const webdesign = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/collections/webdesign" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
      })
});

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
        )
    })
})

export const collections = { 
    ...projectCollections,
    newsletter,
    webdesign
}
