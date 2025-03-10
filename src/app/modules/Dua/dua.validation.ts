import { z } from "zod";

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    thumbnail: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    categoryId: z.string().min(1, "Category ID is required"),
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    thumbnail: z.string().optional(),
    content: z.string().optional(),
    categoryId: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

export const blogValidationSchemas = {
  createBlogSchema,
  updateBlogSchema,
};
