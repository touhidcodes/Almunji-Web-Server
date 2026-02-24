import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { tafsirControllers } from "./tafsir.controller";
import { tafsirValidationSchema } from "./tafsir.validation";

const router = express.Router();

// Route to create a new Tafsir
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.CREATE,
  }),
  validateRequest(tafsirValidationSchema.createTafsirSchema),
  tafsirControllers.createTafsir
);

// Route to get all Tafsir by admins
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.READ,
  }),
  tafsirControllers.getAllTafsirByAdmin
);

// Route to get all Tafsir of a specific Ayah
router.get("/ayah/:ayahId", tafsirControllers.getTafsirByAyah);

// Route to get a specific Tafsir by ID
router.get("/:tafsirId", tafsirControllers.getTafsirById);

// Route to update an existing Tafsir by ID
router.put(
  "/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.UPDATE,
  }),
  validateRequest(tafsirValidationSchema.updateTafsirSchema),
  tafsirControllers.updateTafsir
);

// Route to delete (soft delete) a Tafsir by id
router.delete(
  "/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.TAFSIR,
    action: Action.DELETE,
  }),
  tafsirControllers.deleteTafsir
);

// Route to delete (hard delete) a Tafsir by id only by Admins
router.delete(
  "/admin/:tafsirId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.TAFSIR,
    action: Action.DELETE,
  }),
  tafsirControllers.deleteTafsirByAdmin
);

export const tafsirRoutes = router;
