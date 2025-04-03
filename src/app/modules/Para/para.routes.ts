import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// Route to create a new Para
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(paraValidationSchema.createParaSchema),
  paraControllers.createPara
);

// Route to get all Paras
router.get("/", paraControllers.getAllParas);

// Route to get a specific Para by ID
router.get("/:paraId", paraControllers.getParaById);

// Route to update an existing Para by ID
router.put(
  "/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(paraValidationSchema.updateParaSchema),
  paraControllers.updatePara
);

// Route to delete a Para by ID
router.delete(
  "/:paraId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  paraControllers.deletePara
);

export const paraRoutes = router;
