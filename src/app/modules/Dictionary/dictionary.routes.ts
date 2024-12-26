import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { dictionaryValidationSchema } from "./dictionary.validation";
import { dictionaryControllers } from "./dictionary.controller";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/word",
  validateRequest(dictionaryValidationSchema.createWordSchema),
  dictionaryControllers.createWord
);

// Route to get dictionary words
router.get("/word", dictionaryControllers.getWords);

// Route to get all dictionary words
router.get("/", dictionaryControllers.getAllWords);

// Route to get a specific dictionary word by id
router.get("/:wordId", dictionaryControllers.getWordById);

// Route to update an existing dictionary word by id
router.put(
  "/:wordId",
  validateRequest(dictionaryValidationSchema.updateWordSchema),
  dictionaryControllers.updateWord
);

// Route to delete a dictionary word by id
router.delete("/:wordId", dictionaryControllers.deleteWord);

export const dictionaryRoutes = router;
