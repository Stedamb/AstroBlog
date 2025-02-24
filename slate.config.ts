import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  site: 'https://slate-blog-demo.vercel.app',
  avatar: '/avatar.png',
  title: 'MEDITAZIONI',
  description: 'Pure thoughts, simple stories.',
  lastModified: true,
  readTime: true,
  footer: {
    copyright: 'Copyright © 2025',
  }
});
