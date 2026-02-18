import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import { permissionControllers } from "./permission.controller";

const router = express.Router();

// Create a new permission
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.CREATE,
  }),
  permissionControllers.createPermission
);

// Get all permissions
router.get(
  "/",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.READ,
  }),
  permissionControllers.getAllPermissions
);

// Assign permission to a user
router.post(
  "/assign",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.CREATE,
  }),
  permissionControllers.assignPermissionToUser
);

// Get permissions of a specific user
router.get(
  "/user/:userId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.READ,
  }),
  permissionControllers.getUserPermissions
);

// Remove a permission from a user
router.delete(
  "/remove",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.DELETE,
  }),
  permissionControllers.removeUserPermission
);

// Hard delete a permission
router.delete(
  "/:permissionId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.PERMISSION,
    action: Action.DELETE,
  }),
  permissionControllers.deletePermission
);

export const permissionRoutes = router;
