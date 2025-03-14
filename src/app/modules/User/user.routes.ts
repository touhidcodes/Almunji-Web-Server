import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Routes to get user
router.get(
  "/profile",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  userControllers.getUserProfile
);

// Routes to get all user
router.get(
  "/users/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  userControllers.getAllUser
);

// Routes to get user
router.get(
  "/user",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  userControllers.getUser
);

// Routes to get user with profile
router.get(
  "/user/profile",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  userControllers.getUserWithProfile
);

// Routes to update user
router.put(
  "/user/profile",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUser
);

// Routes to update user status
router.put(
  "/status/:userId",
  auth(UserRole.ADMIN),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserStatus
);

export const userRoutes = router;
