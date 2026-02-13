import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import prisma from "../../utils/prisma";

// Create Permission
const createPermission = async (payload: {
  resource: string;
  action: string;
}) => {
  const permission = await prisma.permission.create({
    data: {
      resource: payload.resource as any,
      action: payload.action as any,
    },
  });

  return permission;
};

// Get All Permissions
const getAllPermissions = async () => {
  return prisma.permission.findMany({
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
  });
};

// Assign Permission to User
const assignPermissionToUser = async (
  payload: {
    userId: string;
    permissionId: string;
  },
  assignedBy: string
) => {
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
  deletePermission,
};
