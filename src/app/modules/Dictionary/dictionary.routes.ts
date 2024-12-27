import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { dictionaryValidationSchema } from "./dictionary.validation";
import { dictionaryControllers } from "./dictionary.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/word",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(dictionaryValidationSchema.createWordSchema),
  dictionaryControllers.createWord
);

// Route to get dictionary words
router.get("/word", dictionaryControllers.getWords);

// Route to get all dictionary words
router.get("/all", dictionaryControllers.getAllWords);

// Route to get a specific dictionary word by id
router.get("/:wordId", dictionaryControllers.getWordById);

// Route to update an existing dictionary word by id
router.put(
  "/:wordId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(dictionaryValidationSchema.updateWordSchema),
  dictionaryControllers.updateWord
);

// Route to delete a dictionary word by id
router.delete(
  "/:wordId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  dictionaryControllers.deleteWord
);

export const dictionaryRoutes = router;
