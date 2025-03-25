import { z } from "zod";

// Schema to create an Ayah
const createAyahSchema = z.object({
  body: z.object({
    surahId: z.string({ required_error: "Surah ID is required" }),
    ayahNumber: z
      .number({ required_error: "Ayah number is required" })
      .int()
      .positive(),
    arabicText: z.string({ required_error: "Arabic text is required" }),
    pronunciation: z.string().optional(),
    banglaText: z.string().optional(),
    englishText: z.string().optional(),
  }),
});

// Schema to update an Ayah
const updateAyahSchema = z.object({
  body: z.object({
    surahId: z.string().optional(),
    ayahNumber: z.number().int().positive().optional(),
    arabicText: z.string().optional(),
    banglaText: z.string().optional(),
    englishText: z.string().optional(),
  }),
});

export const ayahValidationSchema = {
  createAyahSchema,
  updateAyahSchema,
};
