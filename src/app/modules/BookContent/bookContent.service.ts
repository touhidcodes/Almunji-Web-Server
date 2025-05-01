import { BookContent, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";
import { bookContentQueryFields } from "./BookContent.constants";

// Service to create Book Content
const createBookContent = async (contentData: BookContent) => {
  const book = await prisma.book.findUnique({
    where: { id: contentData.bookId },
  });

  if (!book) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await prisma.bookContent.create({
    data: contentData,
    select: {
      id: true,
      book: {
        select: {
          name: true,
        },
      },
      title: true,
      text: true,
      order: true,
    },
  });

  return result;
};

// Get all book contents
const getAllBookContents = async (
  options: any,
  pagination: TPaginationOptions
) => {
  const { searchTerm, isDeleted, sortBy, sortOrder, ...filterData } = options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.BookContentWhereInput[] = [];

  // Convert query param to boolean if present, otherwise default to false
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;

  // Search by only non-deleted book content
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  // Search by book content title and text
  if (searchTerm) {
    andConditions.push({
      OR: bookContentQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  // Add additional filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookContentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bookContent.findMany({
    where: whereConditions,
    select: {
      id: true,
      book: {
        select: {
          name: true,
        },
      },
      title: true,
      text: true,
      order: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.bookContent.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get a single book content by ID
const getBookContentById = async (id: string) => {
  const result = await prisma.bookContent.findUniqueOrThrow({
    where: { id },
  });

  return result;
};

// Get all contents for a specific book
const getContentsByBookId = async (bookId: string) => {
  const result = await prisma.bookContent.findMany({
    where: { bookId },
    orderBy: {
      order: "asc",
    },
  });

  return result;
};

// Update book content
const updateBookContent = async (id: string, data: Partial<BookContent>) => {
  const existing = await prisma.bookContent.findUnique({ where: { id } });

  if (!existing) {
    throw new APIError(httpStatus.NOT_FOUND, "Book content not found!");
  }

  const result = await prisma.bookContent.update({
    where: { id },
    data,
  });

  return result;
};

// Delete book content
const deleteBookContent = async (id: string) => {
  const result = await prisma.bookContent.delete({
    where: { id },
  });

  return result;
};

export const bookContentServices = {
  createBookContent,
  getAllBookContents,
  getBookContentById,
  getContentsByBookId,
  updateBookContent,
  deleteBookContent,
};
