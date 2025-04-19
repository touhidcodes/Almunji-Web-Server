import { z } from "zod";

// Schema to create a Para
const createParaSchema = z.object({
  body: z.object({
    number: z
      .number({ required_error: "Para number is required" })
      .min(1, { message: "Para must be at least 1" })
      .max(30, { message: "Para cannot exceed 30" }),
    arabic: z.string({ required_error: "Arabic name is required" }),
    english: z.string().optional(),
    bangla: z.string().optional(),
    startAyahRef: z.string({
      required_error: "Start Ayah reference is required",
    }),
    endAyahRef: z.string({ required_error: "End Ayah reference is required" }),
  }),
});

// Schema to update a Para
const updateParaSchema = z.object({
  body: z.object({
    number: z.number().int().positive().optional(),
    arabic: z.string().optional(),
    english: z.string().optional(),
    bangla: z.string().optional(),
    startAyahRef: z.string().optional(),
    endAyahRef: z.string().optional(),
  }),
});

// Export validation schema
export const paraValidationSchema = {
  createParaSchema,
  updateParaSchema,
};
