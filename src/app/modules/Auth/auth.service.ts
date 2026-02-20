import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";

import config from "../../config/config";
import APIError from "../../errors/APIError";
import { jwtHelpers } from "../../utils/jwtHelpers";
import prisma from "../../utils/prisma";

import { comparePasswords } from "../../utils/comparePassword";
import { hashedPassword } from "../../utils/hashedPassword";
import { TUserData } from "../User/user.interface";
import { IChangePassword } from "./auth.interface";

// Get user permissions
const getUserPermissions = async (userId: string): Promise<string[]> => {
  const permissions = await prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: true,
    },
  });

  return permissions.map(
    (p) => `${p.permission.resource}:${p.permission.action}`
  );
};

// Create User
const createUser = async (data: TUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUser) {
    throw new APIError(httpStatus.CONFLICT, "Username is already taken");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: passwordHash,
        role: UserRole.USER,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.userProfile.create({
      data: { userId: user.id },
    });

    const permissions = await getUserPermissions(user.id);

    const accessToken = jwtHelpers.generateToken(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      config.jwt.access_token_secret as Secret,
      config.jwt.access_token_expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
      {
        userId: user.id,
        email: user.email,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
      user,
      permissions,
    };
  });

  return result;
};

// Login User
const loginUser = async (payload: { identifier: string; password: string }) => {
  const { identifier, password } = payload;

  if (!identifier) {
    throw new APIError(httpStatus.BAD_REQUEST, "Email or Username is required");
  }

  let user = await prisma.user.findUnique({
    where: { email: identifier, status: UserStatus.ACTIVE },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { username: identifier, status: UserStatus.ACTIVE },
    });
  }

  if (!user) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new APIError(httpStatus.UNAUTHORIZED, "Password incorrect");
  }

  const permissions = await getUserPermissions(user.id);

  const accessToken = jwtHelpers.generateToken(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      userId: user.id,
      email: user.email,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user,
    permissions,
  };
};

// Refresh Token
const refreshToken = async (token: string) => {
  let decoded;

  try {
    decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch {
    throw new APIError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) {
    throw new APIError(httpStatus.UNAUTHORIZED, "User not found");
  }

  const permissions = await getUserPermissions(user.id);

  const accessToken = jwtHelpers.generateToken(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return { accessToken };
};

// Change Password

const changePassword = async (userId: string, payload: IChangePassword) => {
  const { oldPassword, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId, status: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new APIError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isOldPasswordCorrect = await comparePasswords(
    oldPassword,
    user.password
  );

  if (!isOldPasswordCorrect) {
    throw new APIError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  const newHashedPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: newHashedPassword },
  });
};

export const authServices = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
};
