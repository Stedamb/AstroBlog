import type { SitemapOptions } from '@astrojs/sitemap';

export const languages = ['en-US'] as const;
export type LangType = (typeof languages)[number];

export const theme = ['auto', 'light', 'dark'] as const;
/** Theme mode */
export type ThemeMode = (typeof theme)[number];
export interface ThemeOptions {
  /** Mode */
  mode: ThemeMode;
  /** Allow user to switch theme */
  enableUserChange?: boolean;
}

export interface SlateConfig {
  /** Final deployment link */
  site: string;
  /** Language */
  lang?: LangType;
  /** Theme */
  theme?: ThemeOptions;
  /** Avatar */
  avatar?: string;
  /** Sitemap configuration */
  sitemap?: SitemapOptions;
  /** Website title */
  title: string;
  /** Website description */
  description: string;
  /** Show reading time */
  readTime?: boolean;
  /** Show last modified time */
  lastModified?: boolean;
  /** Docsearch configuration */
  algolia?: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
  /** Website footer configuration */
  footer?: {
    copyright: string;
  };
  /** Follow subscription authentication configuration */
  follow?: {
    feedId: string;
    userId: string;
  };
}
