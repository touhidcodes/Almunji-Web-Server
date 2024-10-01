import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { categoryControllers } from "./caregory.controller";
import { categoryValidationSchema } from "./category.validation";

const router = express.Router();

router.post(
  "/category",
  //   auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(categoryValidationSchema.createCategorySchema),
  categoryControllers.createCategory
);

router.get("/categories", categoryControllers.getAllCategories);

router.put(
  "/category/:categoryId",
  //   auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(categoryValidationSchema.updateCategorySchema),
  categoryControllers.updateCategory
);

router.delete(
  "/category/:categoryId",
  //  auth(UserRole.ADMIN),
  categoryControllers.deleteCategory
);

export const categoryRoutes = router;
