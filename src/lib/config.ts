import type { SitemapOptions } from '@astrojs/sitemap';
import type { ThemeMode } from './theme';

export interface ThemeOptions {
  /** Initial theme for visitors without a stored preference. */
  mode: ThemeMode;
  /** Show the theme switcher in the header. */
  enableUserChange: boolean;
}

/** What `slate.config.ts` accepts. */
export interface SiteConfigInput {
  /** Final deployment URL, used for canonical links, sitemap and robots.txt. */
  site: string;
  title: string;
  description: string;
  /** BCP 47 language tag for `<html lang>` and date formatting. */
  lang?: string;
  /** Author name for structured data. Defaults to `title`. */
  author?: string;
  /** A mode shorthand, or full options. */
  theme?: ThemeMode | Partial<ThemeOptions>;
  sitemap?: SitemapOptions;
  /** Show the estimated reading time on posts. */
  readTime?: boolean;
  /** Show the last git commit date on posts. */
  lastModified?: boolean;
  footer?: {
    copyright: string;
  };
}

/** Config with every default applied. */
export interface SiteConfig extends Omit<SiteConfigInput, 'theme'> {
  lang: string;
  author: string;
  theme: ThemeOptions;
  readTime: boolean;
  lastModified: boolean;
}

const DEFAULT_THEME: ThemeOptions = { mode: 'auto', enableUserChange: true };

export function defineConfig(input: SiteConfigInput): SiteConfig {
  const theme = typeof input.theme === 'string' ? { mode: input.theme } : input.theme;

  return {
    lang: 'en-US',
    readTime: false,
    lastModified: false,
    ...input,
    author: input.author ?? input.title,
    theme: { ...DEFAULT_THEME, ...theme },
  };
}
