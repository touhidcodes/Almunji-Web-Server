import httpStatus from "http-status";
import { Action, Resource } from "@/generated/prisma/enums";
import APIError from "@/errors/APIError";
import prisma from "@/utils/prisma";

// Create Permission
const createPermission = async (payload: {
  resource: Resource;
  action: Action;
}) => {
  const { resource, action } = payload;

  // Check if permission already exists
  const existing = await prisma.permission.findUnique({
    where: {
      resource_action: {
        resource,
        action,
      },
    },
  });

  if (existing) {
    throw new APIError(httpStatus.BAD_REQUEST, "Permission already exists!");
  }

  const permission = await prisma.permission.create({
    data: {
      resource: payload.resource as any,
      action: payload.action as any,
    },
  });

  return permission;
};

// Get All Permissions with pagination
const getAllPermissions = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  
  const [permissions, total] = await Promise.all([
    prisma.permission.findMany({
      skip,
      take: limit,
      include: {
        users: {
          select: {
            userId: true,
            assignedBy: true,
            assignedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.permission.count()
  ]);

  return {
    permissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    }
  };
};

// Assign Permission to User
const assignPermissionToUser = async (
  payload: {
    userId: string;
    permissionId: string;
  },
  assignedBy: string
) => {
  // Check if target user is SUPERADMIN (ADMINS can't modify SUPERADMIN permissions)
  const targetUser = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { role: true },
  });

  if (!targetUser) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if assigner is trying to modify SUPERADMIN (only SUPERADMIN can do this)
  const assignerUser = await prisma.user.findUnique({
    where: { id: assignedBy },
    select: { role: true },
  });

  if (targetUser.role === "SUPERADMIN" && assignerUser?.role !== "SUPERADMIN") {
    throw new APIError(
      httpStatus.FORBIDDEN,
      "Only SUPERADMIN can modify SUPERADMIN permissions"
    );
  }

  const exists = await prisma.userPermission.findFirst({
    where: {
      userId: payload.userId,
      permissionId: payload.permissionId,
    },
  });

  if (exists) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Permission already assigned to this user"
    );
  }

  return prisma.userPermission.create({
    data: {
      userId: payload.userId,
      permissionId: payload.permissionId,
      assignedBy,
    },
  });
};

// Get User Permissions
const getUserPermissions = async (userId: string) => {
  return prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: true,
    },
  });
};

// Remove User Permission
const removeUserPermission = async (payload: {
  userId: string;
  permissionId: string;
}) => {
  return prisma.userPermission.delete({
    where: {
      userId_permissionId: {
        userId: payload.userId,
        permissionId: payload.permissionId,
      },
    },
  });
};

// Bulk Assign Permissions to User
const bulkAssignPermissionsToUser = async (
  payload: {
    userId: string;
    permissionIds: string[];
  },
  assignedBy: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Check if user exists
    const user = await tx.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new APIError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if permissions exist
    const existingPermissions = await tx.permission.findMany({
      where: {
        id: { in: payload.permissionIds },
      },
    });

    if (existingPermissions.length !== payload.permissionIds.length) {
      throw new APIError(httpStatus.BAD_REQUEST, "Some permissions not found");
    }

    // Get existing assignments to avoid duplicates
    const existingAssignments = await tx.userPermission.findMany({
      where: {
        userId: payload.userId,
        permissionId: { in: payload.permissionIds },
      },
      select: { permissionId: true },
    });

    const existingPermissionIds = new Set(
      existingAssignments.map((a) => a.permissionId)
    );

    // Create new assignments (skip duplicates)
    const newAssignments = payload.permissionIds
      .filter((id) => !existingPermissionIds.has(id))
      .map((permissionId) => ({
        userId: payload.userId,
        permissionId,
        assignedBy,
      }));

    if (newAssignments.length > 0) {
      await tx.userPermission.createMany({
        data: newAssignments,
        skipDuplicates: true,
      });
    }

    return {
      assigned: newAssignments.length,
      skipped: existingAssignments.length,
      total: payload.permissionIds.length,
    };
  });
};

// Hard Delete Permission
const deletePermission = async (permissionId: string) => {
  const exists = await prisma.permission.findUnique({
    where: { id: permissionId },
  });

  if (!exists) {
    throw new APIError(httpStatus.NOT_FOUND, "Permission not found");
  }

  // Remove junction table first (important)
  await prisma.userPermission.deleteMany({
    where: { permissionId },
  });

  // Hard delete permission
  await prisma.permission.delete({
    where: { id: permissionId },
  });

  return null;
};

export const permissionServices = {
  createPermission,
  getAllPermissions,
  assignPermissionToUser,
  getUserPermissions,
  removeUserPermission,
  bulkAssignPermissionsToUser,
  deletePermission,
};
