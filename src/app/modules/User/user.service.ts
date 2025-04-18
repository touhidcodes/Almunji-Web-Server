import prisma from "../../utils/prisma";
import { Prisma, UserProfile } from "@prisma/client";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import config from "../../config/config";

//  Service to get user
const getUser = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      username: true,
    },
  });

  return result;
};

//  Service to get all user
const getAllUser = async (currentUserEmail: string) => {
  const result = await prisma.user.findMany({
    where: {
      email: {
        notIn: [config.superAdmin.super_admin_email, currentUserEmail],
      },
    },
  });

  return result;
};

//  Service to get user with profile
const getUserWithProfile = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      username: true,
    },
  });

  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: user.id,
    },
  });
  return {
    ...user,
    ...profile,
  };
};

//  Service to get user profile
const getUserProfile = async (id: string) => {
  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: id,
    },
  });
  return result;
};

//  Service to update user
const updateUser = async (
  id: string,
  userData: Partial<UserProfile> & { username?: string; email?: string }
) => {
  const { email, username, ...profileData } = userData;

  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  if (username && username !== existingUser.username) {
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUsername) {
      throw new APIError(httpStatus.CONFLICT, "Username is already taken");
    }
  }

  if (email && email !== existingUser.email) {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      throw new APIError(httpStatus.CONFLICT, "Email is already taken");
    }
  }

  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      username: username || existingUser.username,
      email: email || existingUser.email,
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

  // Service to update user profile
  const updatedProfile = await prisma.userProfile.update({
    where: {
      userId: id,
    },
    data: profileData,
  });

  return {
    ...result,
    ...updatedProfile,
  };
};

// Service to update user status
const updateUserStatus = async (
  userId: string,
  updatedData: Partial<Prisma.UserUpdateInput>
) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
  return result;
};

export const userServices = {
  getUser,
  getUserProfile,
  updateUser,
  getUserWithProfile,
  getAllUser,
  updateUserStatus,
};
