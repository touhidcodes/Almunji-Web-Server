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
    transliteration: z.string().optional(),
    bangla: z.string().optional(),
    english: z.string().optional(),
  }),
});

// Schema to update an Ayah
const updateAyahSchema = z.object({
  body: z
    .object({
      number: z.any().optional(),
      surahId: z.any().optional(),
      paraId: z.any().optional(),
      arabic: z.string().optional(),
      transliteration: z.string().optional(),
      bangla: z.string().optional(),
      english: z.string().optional(),
    })
    .refine(
      (data) =>
        data.number === undefined &&
        data.surahId === undefined &&
        data.paraId === undefined,
      {
        message: "Fields 'number', 'surahId', and 'paraId' cannot be updated.",
        path: ["restrictedFields"],
      }
    ),
});

export const ayahValidationSchema = {
  createAyahSchema,
  updateAyahSchema,
};
