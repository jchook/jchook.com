import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "#src/lib/posts";
import { toInstant } from "#src/lib/dates";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "jchook.com",
    description:
      "Short posts on Void Linux, xmonad, Rust, and whatever else is on the workbench. By Wes Roberts.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: toInstant(p.data.date, p.data.tz),
      link: `/posts/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
