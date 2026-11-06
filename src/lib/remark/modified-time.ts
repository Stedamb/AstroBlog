import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import type { RemarkPlugin } from '@astrojs/markdown-remark';

/** Last commit date of a file, falling back to its mtime when it is new or git is unavailable. */
export function getLastModified(filepath: string): Date {
  try {
    const iso = execFileSync('git', ['log', '-1', '--pretty=format:%cI', '--', filepath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // Not a git checkout (e.g. a CI tarball); use the filesystem below.
  }
  return statSync(filepath).mtime;
}

/** Exposes `lastModified` (ISO string) on `remarkPluginFrontmatter`. */
export const remarkModifiedTime: RemarkPlugin = () => (_tree, file) => {
  const frontmatter = file.data.astro?.frontmatter;
  if (frontmatter && file.path) frontmatter.lastModified = getLastModified(file.path).toISOString();
};
