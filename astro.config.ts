import { defineConfig } from 'astro/config';
import { type RemarkPlugin, unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import astroExpressiveCode from 'astro-expressive-code';
import rehypeFigure from 'rehype-figure';
import rehypeKatex from 'rehype-katex';
import remarkBlockContainers from 'remark-block-containers';
import codeImport from 'remark-code-import';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';

import { remarkModifiedTime } from './src/lib/remark/modified-time';
import { remarkReadingTime } from './src/lib/remark/reading-time';
import config from './slate.config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: config.site,
  integrations: [astroExpressiveCode(), mdx(), sitemap(config.sitemap)],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkGemoji,
        remarkMath,
        // Its typings declare an async transformer return type that unified's types reject.
        codeImport as RemarkPlugin,
        remarkBlockContainers,
        ...(config.lastModified ? [remarkModifiedTime] : []),
        ...(config.readTime ? [remarkReadingTime] : []),
      ],
      rehypePlugins: [rehypeKatex, rehypeFigure],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
