import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  site: 'https://slate-blog-demo.vercel.app',
  avatar: '/avatar.png',
  title: 'MEDITAZIONI',
  description: 'Un diario di riflessioni personali',
  lastModified: true,
  readTime: true,
  footer: {
    copyright: 'Copyright © 2025',
  }
});
