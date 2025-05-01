import { z } from "zod";

// Define a reasonable max length for content (e.g., 65535 for TEXT in MySQL)
// Adjust based on your DB's actual type (you used `@db.LongText`, so it's large).
const MAX_CONTENT_LENGTH = 65535;

const createContentSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Content title is required" }),
    order: z
      .number({ required_error: "Order number is required" })
      .int()
      .min(1, "Order must be a positive integer"),
    text: z
      .string({ required_error: "Content text is required" })
      .min(1)
      .max(
        MAX_CONTENT_LENGTH,
        `Content must be under ${MAX_CONTENT_LENGTH} characters`
      ),
  }),
});

const updateContentSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    order: z.number().int().min(1).optional(),
    text: z.string().max(MAX_CONTENT_LENGTH).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const bookContentValidationSchema = {
  createContentSchema,
  updateContentSchema,
};
