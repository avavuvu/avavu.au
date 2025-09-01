// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), sitemap()],
  site: "https://avavu.au",

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()]
  },
  
  experimental: {
    session: true,
  },
  adapter: netlify({
    cacheOnDemandPages: true,
    
  }),
});