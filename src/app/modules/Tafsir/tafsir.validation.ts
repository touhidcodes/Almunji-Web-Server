import { z } from "zod";

// Schema to create a Tafsir
const createTafsirSchema = z.object({
  body: z.object({
    ayahId: z.string({ required_error: "Ayah ID is required" }),
    title: z.string().optional(),
    text: z.string({ required_error: "Tafsir text is required" }),
    scholar: z.string().optional(),
    reference: z.string().optional(),
  }),
});

// Schema to update a Tafsir
const updateTafsirSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    scholar: z.string().optional(),
    reference: z.string().optional(),
  }),
});

// Export validation schema
export const tafsirValidationSchema = {
  createTafsirSchema,
  updateTafsirSchema,
};
