import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { ayahControllers } from "./ayah.controller";
import { ayahValidationSchema } from "./ayah.validation";

const router = express.Router();

// Route to create a new Ayah
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.CREATE,
  }),
  validateRequest(ayahValidationSchema.createAyahSchema),
  ayahControllers.createAyah
);

// Route to get a all Ayah
router.get("/all", ayahControllers.getAllAyahs);

// Route to get a specific Ayah by ID
router.get("/:ayahId", ayahControllers.getAyahById);

// Route to get Ayah by Para ID
router.get("/para/:paraId", ayahControllers.getAyahsByParaId);

// Route to get Ayah by Surah ID
router.get("/surah/:surahId", ayahControllers.getAyahsBySurahId);

// Route to get Ayahs and their Tafsir by Surah ID
router.get("/tafsir/:surahId", ayahControllers.getAyahsAndTafsirBySurahId);

// Route to update an existing Ayah by ID
router.put(
  "/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.UPDATE,
  }),
  validateRequest(ayahValidationSchema.updateAyahSchema),
  ayahControllers.updateAyah
);

// Route to delete an Ayah (Soft Delete)
router.delete(
  "/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.DELETE,
  }),
  ayahControllers.deleteAyah
);

// Route to delete an Ayah (Hard Delete) only by Admin
router.delete(
  "/admin/:ayahId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
    resource: Resource.AYAH,
    action: Action.DELETE,
  }),
  ayahControllers.deleteAyahByAdmin
);

export const ayahRoutes = router;
