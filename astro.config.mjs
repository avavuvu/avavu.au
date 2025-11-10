// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import sitemap from "@astrojs/sitemap";
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), sitemap({
    filter: (page) => !page.includes("dev")
  }), markdoc({
    typographer: true
  })],

  site: "https://avavu.au",

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()]
  },

  adapter: netlify({})
});