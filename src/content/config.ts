import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
      pinned: z.number().int().positive().optional(),
      cover: image().or(z.string()).optional(),
      toc: z.boolean().default(true)
    })
});

export const collections = {
  posts
};
