import { z } from "zod";

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().min(1, "Content is required"),
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().optional(),
    isPublished: z.boolean().optional(),
    IsFeatured: z.boolean().optional(),
  }),
});

export const blogValidationSchemas = {
  createBlogSchema,
  updateBlogSchema,
};
