import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function formatReadingTime(text: string) {
  const minutes = Math.max(1, Math.round(getReadingTime(text).minutes));
  return `${minutes} min read`;
}

/** Exposes `minutesRead` (e.g. "4 min read") on `remarkPluginFrontmatter`. */
export const remarkReadingTime: RemarkPlugin = () => (tree, file) => {
  const frontmatter = file.data.astro?.frontmatter;
  if (frontmatter) frontmatter.minutesRead = formatReadingTime(toString(tree));
};
