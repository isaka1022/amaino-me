import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";
import { rehypeLinkCard } from './src/lib/rehype-link-card.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://amaino.me',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        if (page.includes('/admin/')) return false;
        if (page.includes('/blog/tag/')) return false;
        if (/\/blog\/page\/[2-9]/.test(page)) return false;
        if (/\/blog\/category\/.+\/[2-9]/.test(page)) return false;
        if (page.includes('/lp/')) return false;
        return true;
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeLinkCard],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
