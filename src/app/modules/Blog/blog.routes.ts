import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { categoryControllers } from "./caregory.controller";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

// Route to post category
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(categoryValidationSchema.createCategorySchema),
  categoryControllers.createCategory
);

// Route to get all categories
router.get("/all", categoryControllers.getAllCategories);

// Route to update specific categories
router.put(
  "/:categoryId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(categoryValidationSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

// Route to delete specific categories
router.delete(
  "/:categoryId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  categoryControllers.deleteCategory
);

export const categoryRoutes = router;
