import { z } from "zod";

// Schema to create a Para
const createParaSchema = z.object({
  body: z.object({
    number: z
      .number({ required_error: "Para number is required" })
      .int()
      .positive(),
    english: z.string({ required_error: "English name is required" }),
    arabic: z.string().optional(),
    bangla: z.string().optional(),
  }),
});

// Schema to update a Para
const updateParaSchema = z.object({
  body: z.object({
    number: z.number().int().positive().optional(),
    english: z.string().optional(),
    arabic: z.string().optional(),
    bangla: z.string().optional(),
  }),
});

// Export validation schema
export const paraValidationSchema = {
  createParaSchema,
  updateParaSchema,
};
