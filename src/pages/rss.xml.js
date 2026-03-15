import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = await getCollection("blog", ({ data }) => !data.draft && !data.unlisted);
  const sorted = blog.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
