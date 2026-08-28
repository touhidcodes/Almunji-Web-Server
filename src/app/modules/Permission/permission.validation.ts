import { Action, Resource } from "@/generated/prisma/enums";
import { z } from "zod";

// Create Permission
const createPermissionSchema = z.object({
  body: z.object({
    resource: z.nativeEnum(Resource, {
      required_error: "Resource is required",
    }),
    action: z.nativeEnum(Action, {
      required_error: "Action is required",
    }),
  }),
});

// Assign Permission to User
const assignPermissionSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }),
    permissionId: z.string({ required_error: "Permission ID is required" }),
  }),
});

// Remove Permission from User
const removePermissionSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }),
    permissionId: z.string({ required_error: "Permission ID is required" }),
  }),
});

// Bulk Assign Permissions to User
const bulkAssignPermissionsSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }),
    permissionIds: z.array(z.string()).min(1, "At least one permission ID is required"),
  }),
});

export const permissionValidationSchema = {
  createPermissionSchema,
  assignPermissionSchema,
  removePermissionSchema,
  bulkAssignPermissionsSchema,
};
