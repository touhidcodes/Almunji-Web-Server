import { z } from "zod";

// Schema to create a word
const createWordSchema = z.object({
  body: z.object({
    persianWord: z.string({ required_error: "Persian word is required" }),
    transliteration: z.string().optional(),
    banglaMeaning: z.string({ required_error: "Bangla meaning is required" }),
    englishMeaning: z.string().optional(),
    exampleFA: z.string().optional(),
    exampleEN: z.string().optional(),
    exampleBN: z.string().optional(),
  }),
});

// Schema to update a word
const updateWordSchema = z.object({
  body: z.object({
    persianWord: z.string().optional(),
    transliteration: z.string().optional(),
    banglaMeaning: z.string().optional(),
    englishMeaning: z.string().optional(),
    exampleFA: z.string().optional(),
    exampleEN: z.string().optional(),
    exampleBN: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const dictionaryValidationSchema = {
  createWordSchema,
  updateWordSchema,
};
