# Meditazioni

A minimalist, content-first blog built with Astro. Based on the [Slate](https://astro.build/themes/author/2011) theme and designed to publish notes straight from [Obsidian](https://obsidian.md/).

- Light, dark and system themes with a WebGL "liquid ripple" transition
- Drafts visible in local dev only, filtered out of production builds
- Reading time and last-edited date (from git history) on posts
- Markdown extras: containers, KaTeX math, emoji shortcodes, figure captions, code imports
- SEO: canonical URLs, Open Graph/Twitter cards, JSON-LD, sitemap, robots.txt
- Zero client-side framework: interactive bits are small custom elements

## Stack

Astro 7 · TypeScript (strictest) · Tailwind CSS v4 · Expressive Code · Vitest · ESLint · Prettier

## Getting started

Requires Node `>=22.12` (see `.nvmrc`) and pnpm (pinned via `packageManager`; run `corepack enable` once).

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Scripts

| Script                         | What it does                                         |
| ------------------------------ | ---------------------------------------------------- |
| `pnpm dev`                     | Dev server with drafts visible                       |
| `pnpm build`                   | Static production build into `dist/`                 |
| `pnpm preview`                 | Serve the production build                           |
| `pnpm check`                   | Type-check `.astro` and `.ts` files                  |
| `pnpm lint` / `lint:fix`       | ESLint (TypeScript, Astro, a11y rules)               |
| `pnpm format` / `format:check` | Prettier (with Astro and Tailwind class sorting)     |
| `pnpm test` / `test:watch`     | Unit tests with Vitest                               |
| `pnpm validate`                | Everything CI runs: check, lint, format, test, build |

### Quality gates

- **pre-commit** (husky + lint-staged): ESLint and Prettier on staged files.
- **commit-msg**: commitlint with the Angular convention (`feat: …`, `fix: …`).
- **CI** (`.github/workflows/ci.yml`): `pnpm validate` on every push to `main` and every PR.

## Project structure

```
slate.config.ts          Site config (title, theme, features) — import it as `@config`
astro.config.ts          Astro integrations and the Markdown pipeline
src/
├── content.config.ts    Post collection schema
├── content/post/        Posts (.md / .mdx); the filename is the URL slug
├── pages/               Routes: home, /blog/[slug], 404, robots.txt
├── layouts/             PageLayout (head, header, footer)
├── components/
│   ├── seo/             HeadMeta, JsonLd
│   └── theme/           ThemeInit (no-flash script), ThemeSelect, ripple shader
├── lib/                 Framework-free logic, unit tested (*.test.ts)
│   └── remark/          Reading-time and last-modified remark plugins
├── styles/              Tailwind entry (global.css) and design tokens (colors.css)
└── assets/icons/        SVGs imported as Astro components
```

Import from `src/` with the `@/` alias, e.g. `import { getPosts } from '@/lib/posts'`.

## Configuration

`slate.config.ts`:

| Option         | Type                                                                             | Default                                    |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| `site`         | `string` — deployment URL                                                        | required                                   |
| `title`        | `string`                                                                         | required                                   |
| `description`  | `string`                                                                         | required                                   |
| `lang`         | `string` — BCP 47 tag for `<html lang>` and dates                                | `'en-US'`                                  |
| `author`       | `string` — used in structured data                                               | `title`                                    |
| `theme`        | `'auto' \| 'light' \| 'dark'` or `{ mode, enableUserChange }`                    | `{ mode: 'auto', enableUserChange: true }` |
| `sitemap`      | [SitemapOptions](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | —                                          |
| `readTime`     | `boolean`                                                                        | `false`                                    |
| `lastModified` | `boolean` — last commit date of the post file                                    | `false`                                    |
| `footer`       | `{ copyright: string }`                                                          | —                                          |

## Writing posts

Create `src/content/post/my-post.md` → `/blog/my-post`. An Obsidian template lives in `Obsidian Template/`.

| Frontmatter   | Type       | Notes                          |
| ------------- | ---------- | ------------------------------ |
| `title`       | `string`   | required                       |
| `description` | `string`   |                                |
| `tags`        | `string[]` |                                |
| `draft`       | `boolean`  | drafts only show in `pnpm dev` |
| `pubDate`     | `date`     | required unless `draft: true`  |

Beyond standard Markdown and GFM:

```md
:::info
Containers via `:::` markers
:::

Inline math $E = mc^2$ and blocks $$ E = mc^2 $$

![This alt text becomes a figure caption](image-url)
```

## License

MIT — see `LICENSE.txt`.
