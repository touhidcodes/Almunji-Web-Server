import { z } from "zod";

// Schema to create a book
const createBookSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Book name is required" }),
    description: z.string({ required_error: "Book description is required" }),
    cover: z.string({ required_error: "Cover must be a valid URL" }),
    content: z.string({ required_error: "Book content is required" }),
    categoryId: z.string({ required_error: "Category ID is required" }),
  }),
});

// Schema to update a book
const updateBookSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    cover: z.string().url().optional(),
    content: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const bookValidationSchema = {
  createBookSchema,
  updateBookSchema,
};
