import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { surahControllers } from "./surah.controller";

const router = express.Router();

// Route to create a new Surah
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(surahValidationSchema.createSurahSchema),
  surahControllers.createSurah
);

// Route to get all Surahs
router.get("/all", surahControllers.getAllSurahs);

// Route to get a specific Surah by ID
router.get("/:surahId", surahControllers.getSurahById);

// Route to update an existing Surah by ID
router.put(
  "/:surahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(surahValidationSchema.updateSurahSchema),
  surahControllers.updateSurah
);

// Route to delete a Surah by ID
router.delete(
  "/:surahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  surahControllers.deleteSurah
);

export const surahRoutes = router;
