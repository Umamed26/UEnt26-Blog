import { defineCollection, z } from "astro:content";
import { postCategoryValues, projectStatusValues } from "@/config/taxonomy";

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
        category: z.enum(postCategoryValues).default("meta"),
        series: z.string().trim().min(1).optional(),
        project: z.string().trim().min(1).optional(),
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

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(projectStatusValues),
    stack: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string()
        })
      )
      .default([]),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().default(false)
  })
});

const now = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date(),
    focusItems: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string()
        })
      )
      .default([]),
    currentItems: z.array(z.string()).default([]),
    nextItems: z.array(z.string()).default([]),
    quickLinks: z
      .array(
        z.object({
          label: z.string(),
          href: z.string()
        })
      )
      .default([])
  })
});

export const collections = {
  posts,
  projects,
  now
};
