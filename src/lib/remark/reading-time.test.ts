import { describe, expect, it } from 'vitest';
import { formatReadingTime } from './reading-time';

describe('formatReadingTime', () => {
  it('never reports less than one minute', () => {
    expect(formatReadingTime('hello')).toBe('1 min read');
  });

  it('rounds to whole minutes', () => {
    expect(formatReadingTime('word '.repeat(600))).toBe('3 min read');
  });
});
