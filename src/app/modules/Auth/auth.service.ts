import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../utils/jwtHelpers";
import prisma from "../../utils/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { UserRole, UserStatus } from "@prisma/client";
import { IChangePassword } from "./auth.interface";
import { comparePasswords } from "../../utils/comparePassword";
import { hashedPassword } from "../../utils/hashedPassword";
import { TUserData } from "../User/user.interface";

//  Service to create user
const createUser = async (data: TUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    throw new APIError(httpStatus.CONFLICT, "Username is already taken");
  }

  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    username: data.username,
    email: data.email,
    role: UserRole.USER,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const userId = createdUserData.id;

    await transactionClient.userProfile.create({
      data: {
        userId: userId,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        username: userData.username,
        userId: userId,
        role: UserRole.USER,
      },
      config.jwt.access_token_secret as Secret,
      config.jwt.access_token_expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        username: userData.username,
        userId: userId,
        role: UserRole.USER,
      },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
      createdUserData,
    };
  });

  return result;
};

//  Service to login user
const loginUser = async (payload: { identifier: string; password: string }) => {
  const { identifier } = payload;

  if (!identifier) {
    throw new APIError(httpStatus.NOT_FOUND, "Email or Username is required");
  }

  let userData = await prisma.user.findUnique({
    where: {
      email: identifier,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    userData = await prisma.user.findUnique({
      where: {
        username: identifier,
        status: UserStatus.ACTIVE,
      },
    });
  }

  if (!userData) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

//  Service to get refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};

//  Service to change password
const changePassword = async (userId: string, payload: IChangePassword) => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new APIError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new APIError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
    },
  });
};

export const authServices = {
  createUser,
  loginUser,
  refreshToken,
  changePassword,
};
