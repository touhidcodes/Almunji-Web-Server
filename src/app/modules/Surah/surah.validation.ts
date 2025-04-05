import { z } from "zod";

// Schema to create a Surah
const createSurahSchema = z.object({
  body: z.object({
    chapter: z.number({ required_error: "Chapter number is required" }),
    totalAyah: z.number({ required_error: "Total Ayah count is required" }),
    arabic: z.string({ required_error: "Arabic name is required" }),
    english: z.string({ required_error: "English name is required" }),
    bangla: z.string().optional(),
    history: z.string().optional(),
    revelation: z.string({ required_error: "Revelation type is required" }),
  }),
});

// Schema to update a Surah
const updateSurahSchema = z.object({
  body: z.object({
    chapter: z.number().optional(),
    totalAyah: z.number().optional(),
    arabic: z.string().optional(),
    english: z.string().optional(),
    bangla: z.string().optional(),
    history: z.string().optional(),
    revelation: z.string().optional(),
  }),
});

export const surahValidationSchema = {
  createSurahSchema,
  updateSurahSchema,
};
