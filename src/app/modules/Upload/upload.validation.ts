import { z } from "zod";

// Schema to create a word
const createWordSchema = z.object({
  body: z.object({
    word: z.string({ required_error: "Word is required" }),
    description: z.string({ required_error: "Description is required" }),
    pronunciation: z.string({ required_error: "Pronunciation is required" }),
  }),
});

// Schema to update a word
const updateWordSchema = z.object({
  body: z.object({
    word: z.string().optional(),
    description: z.string().optional(),
    pronunciation: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const dictionaryValidationSchema = {
  createWordSchema,
  updateWordSchema,
};
