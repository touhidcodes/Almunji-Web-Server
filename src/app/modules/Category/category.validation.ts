import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Category name is required" }),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const categoryValidationSchema = {
  createCategorySchema,
  updateCategorySchema,
};
