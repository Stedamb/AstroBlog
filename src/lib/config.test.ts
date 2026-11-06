import { describe, expect, it } from 'vitest';
import { defineConfig } from './config';

const base = { site: 'https://example.com', title: 'Blog', description: 'Posts' };

describe('defineConfig', () => {
  it('applies defaults', () => {
    expect(defineConfig(base)).toMatchObject({
      lang: 'en-US',
      author: 'Blog',
      readTime: false,
      lastModified: false,
      theme: { mode: 'auto', enableUserChange: true },
    });
  });

  it('accepts a theme mode shorthand', () => {
    expect(defineConfig({ ...base, theme: 'dark' }).theme).toEqual({ mode: 'dark', enableUserChange: true });
  });

  it('merges partial theme options over the defaults', () => {
    expect(defineConfig({ ...base, theme: { enableUserChange: false } }).theme).toEqual({
      mode: 'auto',
      enableUserChange: false,
    });
  });
});
