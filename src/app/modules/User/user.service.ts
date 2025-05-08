import prisma from "../../utils/prisma";
import { User, UserProfile } from "@prisma/client";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import config from "../../config/config";

//  Service to get user
const getUser = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
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

//  Service to get user profile
const getUserProfile = async (id: string) => {
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
    select: {
      id: true,
      userId: true,
      name: true,
      image: true,
      bio: true,
      profession: true,
      address: true,
    },
  });
  return {
    ...user,
    ...profile,
  };
};

//  Service to update user profile
const updateUserProfile = async (
  id: string,
  userData: Partial<UserProfile> & {
    username?: string;
    email?: string;
    role?: never;
  }
) => {
  const { email, username, role, ...profileData } = userData;

  if (role !== undefined) {
    throw new APIError(
      httpStatus.FORBIDDEN,
      "Updating user role is not allowed!"
    );
  }

  const existingUser = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (username && username !== existingUser.username) {
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUsername) {
      throw new APIError(httpStatus.CONFLICT, "Username is already taken!");
    }
  }

  if (email && email !== existingUser.email) {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      throw new APIError(httpStatus.CONFLICT, "Email is already taken!");
    }
  }

  const result = await prisma.user.update({
    where: {
      id,
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
const updateUserStatus = async (userId: string, updatedData: Partial<User>) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  });
  return result;
};

export const userServices = {
  getUser,
  getUserProfile,
  updateUserProfile,
  getAllUser,
  updateUserStatus,
};
