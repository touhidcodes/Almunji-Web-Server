import { UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { authControllers } from "./auth.controller";
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
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  }),
  authControllers.changePassword
);

export const authRoutes = router;
