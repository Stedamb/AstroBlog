export interface FormatDateOptions {
  /** Omit the year for dates in the current year. */
  omitCurrentYear?: boolean;
  /** Reference date for `omitCurrentYear`. */
  now?: Date;
}

/** "Feb 25, 2025", or "Feb 25" when `omitCurrentYear` applies. */
export function formatDate(date: Date, lang: string, options: FormatDateOptions = {}) {
  const { omitCurrentYear = false, now = new Date() } = options;
  const showYear = !omitCurrentYear || date.getFullYear() !== now.getFullYear();

  return new Intl.DateTimeFormat(lang, {
    month: 'short',
    day: 'numeric',
    year: showYear ? 'numeric' : undefined,
  }).format(date);
}
