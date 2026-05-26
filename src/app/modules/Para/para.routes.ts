import express from "express";
import { Action, Resource, UserRole } from "@/generated/prisma/enums";
import authAccess from "@/middlewares/authAccess";
import validateRequest from "@/middlewares/validateRequest";
import { paraControllers } from "./para.controller";
import { paraValidationSchema } from "./para.validation";

const router = express.Router();

// Create a new Para
router.post(
  "/",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
    action: Action.CREATE,
  }),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

// Get all Paras
router.get("/", paraControllers.getAllParas);

// Get all Paras (admin)
router.get(
  "/admin",
  authAccess({
    roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.PARA,
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
    resource: Resource.PARA,
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
    resource: Resource.PARA,
    action: Action.DELETE,
  }),
  paraControllers.deletePara
);

export const paraRoutes = router;
