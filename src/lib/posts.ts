import { getCollection, type CollectionEntry } from "astro:content";
import { toInstant } from "./dates";

export type Post = CollectionEntry<"blog">;

/** All non-draft posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      toInstant(b.data.date, b.data.tz).getTime() -
      toInstant(a.data.date, a.data.tz).getTime(),
  );
}

export interface PostNeighbors {
  /** The next-newer post, if any. */
  newer: Post | undefined;
  /** The next-older post, if any. */
  older: Post | undefined;
}

export function neighborsOf(posts: Post[], post: Post): PostNeighbors {
  const i = posts.findIndex((p) => p.id === post.id);
  return { newer: posts[i - 1], older: posts[i + 1] };
}

/** Posts sharing at least one tag, ranked by overlap then recency. */
export function relatedTo(posts: Post[], post: Post, limit = 5): Post[] {
  const tags = new Set(post.data.tags);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, n: p.data.tags.filter((t) => tags.has(t)).length }))
    .filter(({ n }) => n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function allTags(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of posts)
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}
