import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

// Create User
const createUser = catchAsync(async (req, res) => {
  const result = await authServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully!",
    data: {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      token: result.accessToken,
    },
  });
});

// Login User
const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      token: result.accessToken,
    },
  });
});

// Refresh Token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: {
      token: result.accessToken,
    },
  });
});

// Change Password
const changePassword = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const passwordData = req.body;

  await authServices.changePassword(userId, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: null,
  });
});

export const authControllers = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
};
