import { BookmarkType } from "@prisma/client";
import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import prisma from "../../utils/prisma";

// Service to create a Bookmark
const createBookmark = async (data: {
  userId: string;
  itemId: string;
  itemType: BookmarkType;
}) => {
  const { userId, itemId, itemType } = data;

  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      userId,
      itemId,
      itemType,
    },
  });

  if (existingBookmark) {
    throw new APIError(httpStatus.CONFLICT, "This item is already bookmarked");
  }

  const result = await prisma.bookmark.create({
    data: {
      userId,
      itemId,
      itemType,
    },
    select: {
      id: true,
      itemId: true,
      itemType: true,
      createdAt: true,
    },
  });

  return result;
};

// Service to get all bookmarks of a specific user
const getMyBookmarks = async (userId: string) => {
  const result = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      itemId: true,
      itemType: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Service to get a single bookmark
const getSingleBookmark = async (id: string, userId: string) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      itemId: true,
      itemType: true,
      createdAt: true,
    },
  });

  if (!bookmark) {
    throw new APIError(httpStatus.NOT_FOUND, "Bookmark not found");
  }

  return bookmark;
};

// Service to delete a bookmark
const deleteBookmark = async (id: string, userId: string) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!bookmark) {
    throw new APIError(httpStatus.NOT_FOUND, "Bookmark not found");
  }

  const result = await prisma.bookmark.delete({
    where: { id },
    select: {
      id: true,
      itemId: true,
      itemType: true,
    },
  });

  return result;
};

// Get all bookmarks
const getAllBookmarksByAdmin = async () => {
  const result = await prisma.bookmark.findMany({
    select: {
      id: true,
      userId: true,
      itemId: true,
      itemType: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Hard delete bookmark
const deleteBookmarkByAdmin = async (id: string) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
  });

  if (!bookmark) {
    throw new APIError(httpStatus.BAD_REQUEST, "Bookmark doesn't exist!");
  }

  const result = await prisma.bookmark.delete({
    where: { id },
    select: {
      id: true,
      itemId: true,
      itemType: true,
    },
  });

  return result;
};

export const bookmarkServices = {
  createBookmark,
  getMyBookmarks,
  getSingleBookmark,
  deleteBookmark,
  getAllBookmarksByAdmin,
  deleteBookmarkByAdmin,
};
