import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { paraControllers } from "./para.controller";
import { paraValidationSchema } from "./para.validation";

const router = express.Router();

// Create a new Para
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

// Get all Paras
router.get("/", paraControllers.getAllParas);

// Get all Paras
router.get(
  "/admin",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  paraControllers.getAllParasByAdmin
);

// Get a specific Para by ID
router.get("/:paraId", paraControllers.getParaById);

// Update a Para
router.put(
  "/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(paraValidationSchema.updateParaSchema),
  paraControllers.updatePara
);

// Delete a Para (soft delete)
router.delete(
  "/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  paraControllers.deletePara
);

export const paraRoutes = router;
