import { getCollection, type CollectionEntry } from 'astro:content';
import { sortByNewest } from './sort';

export type Post = CollectionEntry<'post'>;

/** Published posts, newest first. Drafts are included in dev only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('post', ({ data }) => import.meta.env.DEV || !data.draft);
  return sortByNewest(posts);
}

export function getPostUrl(post: Post) {
  return `/blog/${post.id}`;
}
