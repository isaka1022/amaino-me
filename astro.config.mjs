import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";
import { rehypeLinkCard } from './src/lib/rehype-link-card.mjs';
import fs from 'node:fs';
import path from 'node:path';

function getUnlistedPaths() {
  const blogDir = path.resolve('./src/content/blog');
  const paths = new Set();
  for (const file of fs.readdirSync(blogDir, { recursive: true })) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const content = fs.readFileSync(path.join(blogDir, String(file)), 'utf-8');
    if (/^unlisted:\s*true/m.test(content)) {
      const slug = String(file).replace(/\.(md|mdx)$/, '');
      paths.add(`/blog/${slug}/`);
    }
  }
  return paths;
}

const unlistedPaths = getUnlistedPaths();

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
        if (unlistedPaths.has(new URL(page).pathname)) return false;
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
