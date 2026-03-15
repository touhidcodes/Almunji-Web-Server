import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { surahControllers } from "./surah.controller";
import { surahValidationSchema } from "./surah.validation";

const router = express.Router();

// Route to create a new Surah
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.CREATE,
  }),
  validateRequest(surahValidationSchema.createSurahSchema),
  surahControllers.createSurah
);

// Route to get all Surahs
router.get("/all", surahControllers.getAllSurahs);

// Route to get all Surahs by Admin
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.READ,
  }),
  surahControllers.getAllSurahsByAdmin
);

// Route to get a specific Surah by ID
router.get("/:surahId", surahControllers.getSurahById);

// Route to update an existing Surah by ID
router.put(
  "/:surahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.SURAH,
    action: Action.UPDATE,
  }),
  validateRequest(surahValidationSchema.updateSurahSchema),
  surahControllers.updateSurah
);

// Route to delete a Surah by ID
router.delete(
  "/admin/:surahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.SURAH,
    action: Action.DELETE,
  }),
  surahControllers.deleteSurah
);

export const surahRoutes = router;
