import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_URL } from "../config";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft && !data.unlisted);
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const lines = sorted.map((post, index) => {
    const url = new URL(`/blog/${post.id}/`, SITE_URL).toString();
    const date = post.data.pubDate.toISOString().slice(0, 10);
    const updated = post.data.updatedDate
      ? post.data.updatedDate.toISOString().slice(0, 10)
      : "";
    const tags = post.data.tags?.join(", ") ?? "";
    return [
      `${index + 1}. ${post.data.title}`,
      `url: ${url}`,
      `published: ${date}`,
      updated ? `updated: ${updated}` : "",
      `category: ${post.data.category}`,
      tags ? `tags: ${tags}` : "",
      `summary: ${post.data.description}`,
      "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  const body = [
    `# ${SITE_TITLE} - LLM Full Index`,
    "",
    `base_url: ${SITE_URL}`,
    `generated_at: ${new Date().toISOString()}`,
    `post_count: ${sorted.length}`,
    "",
    "## Posts",
    "",
    ...lines,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
};
