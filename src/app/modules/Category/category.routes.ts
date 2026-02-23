import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { categoryControllers } from "./caregory.controller";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

// Route to post Category
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.CREATE,
  }),
  validateRequest(categoryValidationSchema.createCategorySchema),
  categoryControllers.createCategory
);

// Route to get all Categories
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
  }),
  categoryControllers.getAllCategoriesByAdmin
);

// Route to update specific Categories
router.put(
  "/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.UPDATE,
  }),
  validateRequest(categoryValidationSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

// Route to delete specific Categories (Soft Delete)
router.delete(
  "/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.DELETE,
  }),
  categoryControllers.deleteCategory
);

// Route to delete specific Categories (Hard Delete) only by Admin
router.delete(
  "/admin/:categoryId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.BOOKCATEGORY,
    action: Action.DELETE,
  }),
  categoryControllers.deleteCategoryByAdmin
);

export const categoryRoutes = router;
