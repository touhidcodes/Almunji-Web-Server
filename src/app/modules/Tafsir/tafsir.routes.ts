import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { tafsirControllers } from "./tafsir.controller";
import { tafsirValidationSchema } from "./tafsir.validation";

const router = express.Router();

// Route to create a new Tafsir
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(tafsirValidationSchema.createTafsirSchema),
  tafsirControllers.createTafsir
);

// Route to get all Tafsirs of a specific Ayah
router.get("/ayah/:ayahId", tafsirControllers.getTafsirsByAyah);

// Route to get a specific Tafsir by ID
router.get("/:tafsirId", tafsirControllers.getTafsirById);

// Route to get a specific Tafsir by  surah
router.get("/:surahId", tafsirControllers.getTafsirById);

// Route to update an existing Tafsir by ID
router.put(
  "/:tafsirId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(tafsirValidationSchema.updateTafsirSchema),
  tafsirControllers.updateTafsir
);

// Route to delete a Tafsir by ID
router.delete(
  "/:tafsirId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  tafsirControllers.deleteTafsir
);

export const tafsirRoutes = router;
