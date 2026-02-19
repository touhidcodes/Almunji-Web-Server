import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { dictionaryControllers } from "./dictionary.controller";
import { dictionaryValidationSchema } from "./dictionary.validation";

const router = express.Router();

// Route to create a new dictionary word
router.post(
  "/word",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.CREATE,
  }),
  validateRequest(dictionaryValidationSchema.createWordSchema),
  dictionaryControllers.createWord
);

// Route to get dictionary words
router.get("/suggestion", dictionaryControllers.getSuggestion);

// Route to get all dictionary words
router.get(
  "/admin/words",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.READ,
  }),
  dictionaryControllers.getAllWordsByAdmin
);

// Route to get a specific dictionary word by id
router.get("/:wordId", dictionaryControllers.getWordById);

// Route to update an existing dictionary word by id
router.put(
  "/:wordId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.UPDATE,
  }),
  validateRequest(dictionaryValidationSchema.updateWordSchema),
  dictionaryControllers.updateWord
);

// Route to delete (soft) a dictionary word by id
router.delete(
  "/:wordId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DICTIONARY,
    action: Action.DELETE,
  }),
  dictionaryControllers.deleteWord
);

// Route to delete (hard) a dictionary word by id only by admins
router.delete(
  "/admin/:wordId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.DICTIONARY,
    action: Action.DELETE,
  }),
  dictionaryControllers.deleteWordByAdmin
);

export const dictionaryRoutes = router;
