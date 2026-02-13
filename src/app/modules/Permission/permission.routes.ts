import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { permissionControllers } from "./permission.controller";

const router = express.Router();

// Create a new permission
router.post(
  "/",
  auth(UserRole.SUPERADMIN),
  permissionControllers.createPermission
);

// Get all permissions
router.get(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  permissionControllers.getAllPermissions
);

// Assign permission to a user
router.post(
  "/assign",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  permissionControllers.assignPermissionToUser
);

// Get permissions of a specific user
router.get(
  "/user/:userId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  permissionControllers.getUserPermissions
);

// Remove a permission from a user
router.delete(
  "/remove",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  permissionControllers.removeUserPermission
);

// Hard delete a permission
router.delete(
  "/:permissionId",
  auth(UserRole.SUPERADMIN),
  permissionControllers.deletePermission
);

export const permissionRoutes = router;
