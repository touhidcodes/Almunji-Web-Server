import { BookContent, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { bookContentQueryFields } from "./BookContent.constants";
import { TBookContentQueryFilter } from "./BookContent.interface";

// Service for create Book Content
const createBookContent = async (contentData: BookContent) => {
  const book = await prisma.book.findUnique({
    where: { id: contentData.bookId },
  });

  if (!book) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const existingContent = await prisma.bookContent.findUnique({
    where: {
      bookId_order: {
        bookId: contentData?.bookId,
        order: contentData?.order,
      },
    },
  });

  if (existingContent) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Book content with this order already exists for this book!"
    );
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

// Service for get all Book Contents by admins
const getAllBookContentByAdmin = async (options: TBookContentQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.BookContentWhereInput[] = [];

  // Default to false unless explicitly set to "true" isDeleted filter
  const isDeletedQuery = filters?.isDeleted === "true";
  andConditions.push({ isDeleted: isDeletedQuery });

  // Search by book content title and text
  if (filters?.searchTerm) {
    andConditions.push({
      OR: bookContentQueryFields.map((field) => ({
        [field]: {
          contains: filters?.searchTerm,
        },
      })),
    });
  }

  // Add additional filters
  if (Object.keys(additional).length > 0) {
    andConditions.push({
      AND: Object.keys(additional).map((key) => ({
        [key]: {
          contains: additional[key],
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

// Service to get only the index of Book Contents by Book ID
const getBookIndexByBookId = async (bookId: string) => {
  const existingBook = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true, name: true, slug: true },
  });

  if (!existingBook) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const index = await prisma.bookContent.findMany({
    where: {
      bookId,
      isDeleted: false,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  });

  return {
    id: existingBook.id,
    book: existingBook.name,
    slug: existingBook.slug,
    index,
  };
};

// Service for get a specific Book Content
const getContentsByBookId = async (bookId: string) => {
  const existingBook = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true, name: true, slug: true },
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
    id: existingBook.id,
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
  const existingBookContent = await prisma.bookContent.findUnique({
    where: { id },
  });

  if (!existingBookContent) {
    throw new APIError(httpStatus.NOT_FOUND, "Book content not found!");
  }

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
  getAllBookContentByAdmin,
  getBookContentById,
  getBookIndexByBookId,
  getContentsByBookId,
  updateBookContent,
  deleteBookContent,
  deleteBookContentByAdmin,
};
