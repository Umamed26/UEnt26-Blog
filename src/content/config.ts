import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false),
        pinned: z.number().int().positive().optional(),
        cover: image().or(z.string()).optional(),
        toc: z.boolean().default(true),
        hidden: z.boolean().default(false),
        unlockCode: z.string().optional(),
        revealCode: z.string().optional()
      })
      .superRefine((data, ctx) => {
        if (data.hidden && !data.unlockCode?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "隐藏文章必须提供 unlockCode",
            path: ["unlockCode"]
          });
        }
      })
});

export const collections = {
  posts
};
