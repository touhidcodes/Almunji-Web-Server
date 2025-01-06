import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";

// Controller to create user
const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully!",
    data: {
      id: result.createdUserData.id,
      username: result.createdUserData.username,
      email: result.createdUserData.email,
      token: result.accessToken,
    },
  });
});

// Controller to get user
const getUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

// Controller to get all user
const getAllUser = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await userServices.getAllUser(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users profile retrieved successfully!",
    data: result,
  });
});

// Controller to get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUserProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

// Controller to get user with profile
const getUserWithProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUserWithProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

// Controller to update user
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

// Controller to update user status
const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await userServices.updateUserStatus(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully!",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getUser,
  updateUser,
  getUserProfile,
  getUserWithProfile,
  getAllUser,
  updateUserStatus,
};
