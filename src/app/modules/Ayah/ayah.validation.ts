import { z } from "zod";

// Schema to create an Ayah
const createAyahSchema = z.object({
  body: z.object({
    surahId: z.string({ required_error: "Surah ID is required" }),
    paraId: z.string({ required_error: "Surah ID is required" }),
    number: z
      .number({ required_error: "Ayah number is required" })
      .int()
      .positive(),
    arabic: z.string({ required_error: "Arabic text is required" }),
    pronunciation: z.string().optional(),
    bangla: z.string().optional(),
    english: z.string().optional(),
  }),
});

// Schema to update an Ayah
const updateAyahSchema = z.object({
  body: z.object({
    surahId: z.string().optional(),
    paraId: z.string().optional(),
    number: z.number().int().positive().optional(),
    arabic: z.string().optional(),
    pronunciation: z.string().optional(),
    bangla: z.string().optional(),
    english: z.string().optional(),
  }),
});

export const ayahValidationSchema = {
  createAyahSchema,
  updateAyahSchema,
};
