import express from "express";
import { authControllers } from "./auth.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { authValidationSchema } from "./auth.validation";

const router = express.Router();

// Routes to register user
router.post(
  "/register",
  validateRequest(authValidationSchema.createUserSchema),
  authControllers.createUser
);

//  Routes to login user
router.post("/login", authControllers.loginUser);

//  Routes to refresh token
router.post("/refresh-token", authControllers.refreshToken);

//  Routes to change password
router.post(
  "/change-password",
  validateRequest(authValidationSchema.changePasswordZodSchema),
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  authControllers.changePassword
);

export const authRoutes = router;
