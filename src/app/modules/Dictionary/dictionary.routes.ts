import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { dictionaryValidationSchema } from "./dictionary.validation";
import { dictionaryControllers } from "./dictionary.controller";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/dictionary",
  validateRequest(dictionaryValidationSchema.createWordSchema),
  dictionaryControllers.createWord
);

// Route to get all dictionary words
router.get("/dictionaries", dictionaryControllers.getAllWords);

// Route to get a specific dictionary word by id
router.get("/dictionary/:wordId", dictionaryControllers.getWordById);

// Route to update an existing dictionary word by id
router.put(
  "/dictionary/:wordId",
  validateRequest(dictionaryValidationSchema.updateWordSchema),
  dictionaryControllers.updateWord
);

// Route to delete a dictionary word by id
router.delete("/dictionary/:wordId", dictionaryControllers.deleteWord);

export const dictionaryRoutes = router;
