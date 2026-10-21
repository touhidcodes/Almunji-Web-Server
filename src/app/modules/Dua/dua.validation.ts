import { z } from "zod";

export const createDuaSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    arabic: z.string().trim().min(1, "Arabic text is required"),
    transliteration: z.string().optional(),
    bangla: z.string().trim().min(1, "Bangla text is required"),
    english: z.string().optional(),
    reference: z.string().optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
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
    tags: z.array(z.string().trim().min(1)).optional(),
  }),
});

export const duaValidationSchemas = {
  createDuaSchema,
  updateDuaSchema,
};
