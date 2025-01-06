import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

// Controller to create user
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUser(req.body);
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

// Controller to login user
const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      id: result.userData.id,
      username: result.userData.username,
      email: result.userData.email,
      token: result.accessToken,
    },
  });
});

// Controller to get refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
  });
});

// Controller to change password
const changePassword = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { ...passwordData } = req.body;

  await authServices.changePassword(userId, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: {
      status: 200,
      message: "Password changed successfully!",
    },
  });
});

export const authControllers = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
};
