import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

// Routes to get session user
router.get(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  userControllers.getUser
);

// Routes to get session user profile
router.get(
  "/profile",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  userControllers.getUserProfile
);

// Routes to get all user
router.get(
  "/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  userControllers.getAllUser
);

// Routes to update user profile
router.put(
  "/profile",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserProfile
);

// Routes to update user status
router.put(
  "/status/:userId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserStatus
);

export const userRoutes = router;
