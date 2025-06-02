import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const baseSchema = {
    title: z.string(),
    date: z.date(),
    flag: z.string().optional(),
    rating: z.number().optional(),
    imageSrc: z.string().or(z.array(z.string())).optional(),
    youtubeId: z.string().optional(),
    collaborators: z.array(
        z.object({
            name: z.string(),
            url: z.string().url().optional()
        })
    ).optional()
}

const music = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/music" }),
    schema: z.object({
        ...baseSchema,
        description: z.string().optional(),
        links: z.object({
            bandcamp: z.string().url().optional(),
            apple: z.string().url().optional(),
            spotify: z.string().url().optional(),
        }).optional()
      })
});

const video = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/video" }),
    schema: z.object({
        ...baseSchema,
        description: z.string().optional(),
        links: z.object({
            youtube: z.string().url()
        }).optional(),
    })
});

const interactive = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/interactive" }),
    schema: z.object({
        ...baseSchema,
        description: z.string().optional(),
        links: z.object({
            url: z.string().url(),
        }).optional(),
      })
});

const ephemera = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/ephemera" }),
    schema: z.object({
        ...baseSchema,
        description: z.string().optional(),
        links: z.object({
            url: z.string().url().optional(),
            instagram: z.string().url().optional(),
        }).optional(),
      })
});

const misc = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/misc" }),
    schema: z.object({
        ...baseSchema,
        description: z.string().optional(),
        links: z.object({
            url: z.string().url().optional(),
            youtube: z.string().url().optional(),
        }).optional(),
      })
});

const webdesign = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/collections/webdesign" }),
    schema: z.object({
        ...baseSchema
      })
});


export const collections = { 
    music, video, interactive, ephemera, misc, webdesign

}