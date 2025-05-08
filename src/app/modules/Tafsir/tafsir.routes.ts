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

// Route to get all Tafsir by admins
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  tafsirControllers.getAllTafsirByAdmin
);

// Route to get all Tafsir of a specific Ayah
router.get("/ayah/:ayahId", tafsirControllers.getTafsirByAyah);

// Route to get a specific Tafsir by ID
router.get("/:tafsirId", tafsirControllers.getTafsirById);

// Route to update an existing Tafsir by ID
router.put(
  "/:tafsirId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(tafsirValidationSchema.updateTafsirSchema),
  tafsirControllers.updateTafsir
);

// Route to delete (soft delete) a Tafsir by id
router.delete(
  "/:tafsirId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  tafsirControllers.deleteTafsir
);

// Route to delete (hard delete) a Tafsir by id only by Admins
router.delete(
  "/admin/:tafsirId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  tafsirControllers.deleteTafsirByAdmin
);

export const tafsirRoutes = router;
