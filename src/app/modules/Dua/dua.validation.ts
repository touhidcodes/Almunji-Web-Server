import { z } from "zod";

// Validation for creating a new Dua
const createDuaSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    arabic: z.string().min(1, "Arabic text is required"),
    transliteration: z.string().optional(),
    bangla: z.string().min(1, "Bangla text is required"),
    english: z.string().optional(),
    reference: z.string().optional(),
    tags: z.string().optional(),
  }),
});

// Validation for updating an existing Dua
const updateDuaSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    arabic: z.string().optional(),
    transliteration: z.string().optional(),
    bangla: z.string().optional(),
    english: z.string().optional(),
    reference: z.string().optional(),
    tags: z.string().optional(),
  }),
});

export const duaValidationSchemas = {
  createDuaSchema,
  updateDuaSchema,
};
