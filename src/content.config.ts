import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const music = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/music" }),
    schema: z.object({
        title: z.string(),
        "year it came out": z.string(),
        description: z.string().optional(),
        links: z.object({
            bandcamp: z.string().url().optional(),
            apple: z.string().url().optional(),
            spotify: z.string().url().optional(),
        }).optional(),
        imageSrc: z.string()
      })
});

const video = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/video" }),
    schema: z.object({
        title: z.string(),
        year: z.string(),
        description: z.string().optional(),
        imageSrc: z.string().optional(),
        youtubeUrl: z.string().optional(),
      })
});

const games = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/collections/games" }),
    schema: z.object({
        title: z.string(),
        "year it came out": z.string(),
        description: z.string().optional(),
        imageSrc: z.string().optional(),
        links: z.object({
            url: z.string().url(),
        }).optional(),
      })
});

export const collections = { 
    music, video, games

}