import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { permissionServices } from "./permission.service";

// Create Permission
const createPermission = catchAsync(async (req, res) => {
  const result = await permissionServices.createPermission(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Permission created successfully!",
    data: result,
  });
});

// Get All Permissions
const getAllPermissions = catchAsync(async (req, res) => {
  const result = await permissionServices.getAllPermissions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions retrieved successfully!",
    data: result,
  });
});

// Assign Permission to User
const assignPermissionToUser = catchAsync(async (req, res) => {
  const assignedBy = req.user.id;
  const result = await permissionServices.assignPermissionToUser(
    req.body,
    assignedBy
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission assigned to user successfully!",
    data: result,
  });
});

// Get User Permissions
const getUserPermissions = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await permissionServices.getUserPermissions(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permissions retrieved successfully!",
    data: result,
  });
});

// Remove Permission from User
const removeUserPermission = catchAsync(async (req, res) => {
  await permissionServices.removeUserPermission(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission removed from user successfully!",
    data: null,
  });
});

// Hard Delete Permission
const deletePermission = catchAsync(async (req, res) => {
  const { permissionId } = req.params;

  await permissionServices.deletePermission(permissionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission deleted permanently!",
    data: null,
  });
});

export const permissionControllers = {
  createPermission,
  getAllPermissions,
  assignPermissionToUser,
  getUserPermissions,
  removeUserPermission,
  deletePermission,
};
