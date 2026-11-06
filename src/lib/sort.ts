interface Dated {
  data: { pubDate?: Date | undefined };
}

/** Newest first. Undated entries (drafts) sort to the top. */
export function sortByNewest<T extends Dated>(entries: readonly T[]): T[] {
  const time = (entry: T) => entry.data.pubDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return [...entries].sort((a, b) => time(b) - time(a));
}
