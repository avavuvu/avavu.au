// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  experimental: {
    session: true,
  },

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()]
  },

  adapter: netlify({
    cacheOnDemandPages: true,
    
  }),
});