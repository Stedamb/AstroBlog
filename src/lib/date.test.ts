import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

const now = new Date(2026, 5, 1);

describe('formatDate', () => {
  it('includes the year by default', () => {
    expect(formatDate(new Date(2026, 1, 25), 'en-US', { now })).toBe('Feb 25, 2026');
  });

  it('omits the current year when asked', () => {
    expect(formatDate(new Date(2026, 1, 25), 'en-US', { omitCurrentYear: true, now })).toBe('Feb 25');
  });

  it('keeps the year for other years even when omitting', () => {
    expect(formatDate(new Date(2024, 3, 16), 'en-US', { omitCurrentYear: true, now })).toBe('Apr 16, 2024');
  });
});
