import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { paraControllers } from "./para.controller";
import { paraValidationSchema } from "./para.validation";

const router = express.Router();

// Create a new Para
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH, // Para is closely related to Ayah/Surah
    action: Action.CREATE,
  }),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

// Get all Paras
router.get("/", paraControllers.getAllParas);

// Get all Paras
router.get(
  "/admin",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.READ,
  }),
  paraControllers.getAllParasByAdmin
);

// Get a specific Para by ID
router.get("/:paraId", paraControllers.getParaById);

// Update a Para
router.put(
  "/:paraId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.UPDATE,
  }),
  validateRequest(paraValidationSchema.updateParaSchema),
  paraControllers.updatePara
);

// Delete a Para (soft delete)
router.delete(
  "/:paraId",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.AYAH,
    action: Action.DELETE,
  }),
  paraControllers.deletePara
);

export const paraRoutes = router;
