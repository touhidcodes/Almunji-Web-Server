import { z } from "zod";

// Schema to create a Tafsir
const createTafsirSchema = z.object({
  body: z.object({
    ayahId: z.string({ required_error: "Ayah ID is required" }),
    heading: z.string().optional(),
    summaryBn: z.string().optional(),
    summaryEn: z.string().optional(),
    detailBn: z.string().optional(),
    detailEn: z.string().optional(),
    scholar: z.string().optional(),
    reference: z.string().optional(),
    tags: z.string().optional(),
  }),
});

// Schema to update a Tafsir
const updateTafsirSchema = z.object({
  body: z.object({
    heading: z.string().optional(),
    summaryBn: z.string().optional(),
    summaryEn: z.string().optional(),
    detailBn: z.string().optional(),
    detailEn: z.string().optional(),
    scholar: z.string().optional(),
    reference: z.string().optional(),
    tags: z.string().optional(),
  }),
});

// Export validation schema
export const tafsirValidationSchema = {
  createTafsirSchema,
  updateTafsirSchema,
};
