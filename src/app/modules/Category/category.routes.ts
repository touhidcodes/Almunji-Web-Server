import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/category",
  //   validateRequest(userValidationSchema.createUserSchema),
  categoryControllers.createCategory
);

router.get(
  "/categories",
  // auth(),
  categoryControllers.getAllCategories
);

router.put(
  "/category/:categoryId",
  //   auth(UserRole.ADMIN, UserRole.USER),
  //   validateRequest(userValidationSchema.updateUserSchema),
  categoryControllers.updateCategory
);

router.delete(
  "/category/:categoryId",
  //  auth(UserRole.ADMIN),
  categoryControllers.deleteCategory
);

export const categoryRoutes = router;
