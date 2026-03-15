import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const categoryEnum = z.enum([
  "book",
  "travel",
  "drama",
  "movie",
  "university-life",
  "life-style",
  "tech",
  "photo",
  "how-to-study",
  "event",
  "uncategorized",
]);

export type Category = z.infer<typeof categoryEnum>;

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  badge: z.string().optional(),
  category: categoryEnum.default("uncategorized"),
  tags: z
    .array(z.string())
    .refine((items) => new Set(items).size === items.length, {
      message: "tags must be unique",
    })
    .optional(),
  lang: z.enum(["ja", "en"]).default("ja"),
  draft: z.boolean().default(false),
  unlisted: z.boolean().default(false),
  originalUrl: z.string().optional(),
  source: z.enum(["wordpress", "techblog", "note", "qiita", "original"]).optional(),
});

export type BlogSchema = z.infer<typeof blogSchema>;

const blogCollection = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: blogSchema,
});

export const collections = {
  blog: blogCollection,
};
