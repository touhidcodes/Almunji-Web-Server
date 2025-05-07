import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { surahControllers } from "./surah.controller";
import { surahValidationSchema } from "./surah.validation";

const router = express.Router();

// Route to create a new Surah
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(surahValidationSchema.createSurahSchema),
  surahControllers.createSurah
);

// Route to get all Surahs
router.get("/all", surahControllers.getAllSurahs);

// Route to get all Surahs by Admin
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  surahControllers.getAllSurahsByAdmin
);

// Route to get a specific Surah by ID
router.get("/:surahId", surahControllers.getSurahById);

// Route to update an existing Surah by ID
router.put(
  "/:surahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(surahValidationSchema.updateSurahSchema),
  surahControllers.updateSurah
);

// Route to delete a Surah by ID
router.delete(
  "/admin/:surahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  surahControllers.deleteSurah
);

export const surahRoutes = router;
