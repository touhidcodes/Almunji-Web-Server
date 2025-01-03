import express from "express";
import { authControllers } from "./auth.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//  Routes to login user
router.post("/login", authControllers.loginUser);

//  Routes to refresh token
router.post("/refresh-token", authControllers.refreshToken);

//  Routes to change password
router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.USER),
  authControllers.changePassword
);

export const authRoutes = router;
