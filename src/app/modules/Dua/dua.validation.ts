import { z } from "zod";

const createDuaSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    arabicText: z.string().min(1, "Arabic text is required"),
    transliteration: z.string().optional(),
    translation: z.string().min(1, "Translation is required"),
    reference: z.string().optional(),
  }),
});

const updateDuaSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    arabicText: z.string().optional(),
    transliteration: z.string().optional(),
    translation: z.string().optional(),
    reference: z.string().optional(),
  }),
});

export const duaValidationSchemas = {
  createDuaSchema,
  updateDuaSchema,
};
