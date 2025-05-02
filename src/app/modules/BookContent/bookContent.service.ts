import { BookContent, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";
import { bookContentQueryFields } from "./BookContent.constants";

// Service for create Book Content
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

// Service for get all Book Contents
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

// Service for get a single Book Content by ID
const getBookContentById = async (id: string) => {
  const result = await prisma.bookContent.findUniqueOrThrow({
    where: { id },
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

// Service for get a specific Book Content
const getContentsByBookId = async (bookId: string) => {
  const existingBook = await prisma.book.findUnique({
    where: { id: bookId },
    select: { name: true, slug: true },
  });

  if (!existingBook) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await prisma.bookContent.findMany({
    where: { bookId },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      title: true,
      text: true,
      order: true,
    },
  });

  return {
    book: existingBook.name,
    slug: existingBook.slug,
    content: result,
  };
};

// Service for update Book Content
const updateBookContent = async (id: string, data: Partial<BookContent>) => {
  if ("bookId" in data) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Updating bookId is not allowed!"
    );
  }

  const existing = await prisma.bookContent.findUnique({ where: { id } });

  if (!existing) {
    throw new APIError(httpStatus.NOT_FOUND, "Book content not found!");
  }

  // If order is being updated, check for unique constraint violation
  if (data.order !== undefined && data.order !== existing.order) {
    const conflict = await prisma.bookContent.findFirst({
      where: {
        bookId: existing.bookId,
        order: data.order,
        NOT: { id },
      },
    });

    if (conflict) {
      throw new APIError(
        httpStatus.CONFLICT,
        `Content with order ${data.order} already exists for this book!`
      );
    }
  }

  const result = await prisma.bookContent.update({
    where: { id },
    data,
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

// Service for delete Book Content (Soft Delete)
const deleteBookContent = async (id: string) => {
  const result = await prisma.bookContent.update({
    where: { id },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      book: {
        select: {
          name: true,
        },
      },
      title: true,
    },
  });

  return result;
};

// Service for delete book content (Hard Delete) only by Admin
const deleteBookContentByAdmin = async (id: string) => {
  const result = await prisma.bookContent.delete({
    where: { id },
    select: {
      id: true,
      book: {
        select: {
          name: true,
        },
      },
      title: true,
    },
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
  deleteBookContentByAdmin,
};
