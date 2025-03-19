import { z } from "zod";

// Schema to create a Surah
const createSurahSchema = z.object({
  body: z.object({
    chapter: z.number({ required_error: "Chapter number is required" }),
    totalAyah: z.number({ required_error: "Total Ayah count is required" }),
    arabicName: z.string({ required_error: "Arabic name is required" }),
    englishName: z.string({ required_error: "English name is required" }),
    banglaName: z.string().optional(),
    history: z.string().optional(),
    revelation: z.string({ required_error: "Revelation type is required" }),
  }),
});

// Schema to update a Surah
const updateSurahSchema = z.object({
  body: z.object({
    chapter: z.number().optional(),
    totalAyah: z.number().optional(),
    arabicName: z.string().optional(),
    englishName: z.string().optional(),
    banglaName: z.string().optional(),
    history: z.string().optional(),
    revelation: z.string().optional(),
  }),
});

export const surahValidationSchema = {
  createSurahSchema,
  updateSurahSchema,
};
