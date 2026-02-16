import { z } from "zod";

// Schema to create a bookmark
const createBookmarkSchema = z.object({
  body: z.object({
    itemId: z.string({ required_error: "Item ID is required!" }),
    itemType: z.enum(["DUA", "AYAH"], {
      required_error: "Item type is required!",
    }),
  }),
});

export const bookmarkValidationSchema = {
  createBookmarkSchema,
};
