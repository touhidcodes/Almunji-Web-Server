import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { categoryControllers } from "./caregory.controller";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

// Route to post Category
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(categoryValidationSchema.createCategorySchema),
  categoryControllers.createCategory
);

// Route to get all Categories
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  categoryControllers.getAllCategoriesByAdmin
);

// Route to update specific Categories
router.put(
  "/:categoryId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(categoryValidationSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

// Route to delete specific Categories (Soft Delete)
router.delete(
  "/:categoryId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  categoryControllers.deleteCategory
);

// Route to delete specific Categories (Hard Delete) only by Admin
router.delete(
  "/admin/:categoryId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  categoryControllers.deleteCategoryByAdmin
);

export const categoryRoutes = router;
