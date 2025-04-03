import { z } from "zod";

// Schema to create a Para
const createParaSchema = z.object({
  body: z.object({
    paraNumber: z
      .number({ required_error: "Para number is required" })
      .int()
      .positive(),
    englishName: z.string({ required_error: "English name is required" }),
    arabicName: z.string().optional(),
    banglaName: z.string().optional(),
  }),
});

// Schema to update a Para
const updateParaSchema = z.object({
  body: z.object({
    paraNumber: z.number().int().positive().optional(),
    englishName: z.string().optional(),
    arabicName: z.string().optional(),
    banglaName: z.string().optional(),
  }),
});

// Export validation schema
export const paraValidationSchema = {
  createParaSchema,
  updateParaSchema,
};
