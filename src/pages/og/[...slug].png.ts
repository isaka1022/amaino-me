import { ImageResponse } from "@vercel/og";
import { getCollection } from "astro:content";
import { SITE_AUTHOR_NAME, SITE_TITLE } from "../../config";

export const prerender = false;

export async function GET({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // URLパスは /og/blog/tech/some-slug.png → slug = "blog/tech/some-slug"
  // collection IDは "tech/some-slug.md" の形式
  const pathWithoutBlog = slug?.replace(/^blog\//, "") ?? "";
  const allPosts = await getCollection("blog");
  const post = allPosts.find(
    (p) => p.id === `${pathWithoutBlog}.md` || p.id === pathWithoutBlog
  );

  const title = post?.data.title ?? SITE_TITLE;

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          border: "1px solid #e5e5e5",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                flex: 1,
                justifyContent: "center",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 40 ? "44px" : "56px",
                      fontWeight: "bold",
                      color: "#000000",
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                      maxWidth: "1056px",
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "28px",
                      color: "#888888",
                    },
                    children: SITE_AUTHOR_NAME,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#000000",
                      fontWeight: "bold",
                    },
                    children: "amaino.me",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
