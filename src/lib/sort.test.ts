import { describe, expect, it } from 'vitest';
import { sortByNewest } from './sort';

const entry = (id: string, pubDate?: Date) => ({ id, data: pubDate ? { pubDate } : {} });

describe('sortByNewest', () => {
  it('orders newest first and puts undated drafts on top', () => {
    const entries = [entry('old', new Date(2020, 0, 1)), entry('draft'), entry('new', new Date(2025, 0, 1))];
    expect(sortByNewest(entries).map((e) => e.id)).toEqual(['draft', 'new', 'old']);
  });

  it('keeps the order of several drafts stable', () => {
    expect(sortByNewest([entry('a'), entry('b'), entry('c', new Date(2025, 0, 1))]).map((e) => e.id)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('does not mutate the input', () => {
    const entries = [entry('a', new Date(2020, 0, 1)), entry('b', new Date(2025, 0, 1))];
    sortByNewest(entries);
    expect(entries.map((e) => e.id)).toEqual(['a', 'b']);
  });
});
