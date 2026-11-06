import { defineConfig } from './src/lib/config';

export default defineConfig({
  site: 'https://slate-blog-demo.vercel.app',
  title: 'MEDITAZIONI',
  description: 'Un diario di riflessioni personali',
  author: "Stefano D'Ambrosio",
  lastModified: true,
  readTime: true,
  footer: {
    copyright: 'Copyright © 2025',
  },
});
