import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { paraValidationSchema } from "./para.validation";
import { paraControllers } from "./para.controller";

const router = express.Router();

// Route to create a new Para
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

// Route to get all Paras
router.get("/all", paraControllers.getAllParas);

// Route to get all Paras by admins
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  paraControllers.getAllParasByAdmin
);

// Route to get a specific Para by ID
router.get("/:paraId", paraControllers.getParaById);

// Route to update an existing Para by ID
router.put(
  "/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(paraValidationSchema.updateParaSchema),
  paraControllers.updatePara
);

// Route to delete a Para by ID
router.delete(
  "/admin/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  paraControllers.deletePara
);

export const paraRoutes = router;
