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

// Route to get a specific Ayah by ID
router.get("/:ayahId", ayahControllers.getAyahById);

// Route to update an existing Ayah by ID
router.put(
  "/:ayahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(ayahValidationSchema.updateAyahSchema),
  ayahControllers.updateAyah
);

// Route to delete an Ayah by ID
router.delete(
  "/:ayahId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  ayahControllers.deleteAyah
);

export const ayahRoutes = router;
