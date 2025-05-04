import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ayahValidationSchema } from "./ayah.validation";
import { ayahControllers } from "./ayah.controller";

const router = express.Router();

// Route to create a new Ayah
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
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
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(ayahValidationSchema.updateAyahSchema),
  ayahControllers.updateAyah
);

// Route to delete an Ayah (Soft Delete)
router.delete(
  "/:ayahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  ayahControllers.deleteAyah
);

// Route to delete an Ayah (Hard Delete) only by Admin
router.delete(
  "/admin/:ayahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  ayahControllers.deleteAyahByAdmin
);

export const ayahRoutes = router;
