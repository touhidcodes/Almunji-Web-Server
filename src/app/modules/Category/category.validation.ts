import { z } from "zod";

// Schema to create a category
const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Category name is required" }),
  }),
});

// Schema to update a category
const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const categoryValidationSchema = {
  createCategorySchema,
  updateCategorySchema,
};
