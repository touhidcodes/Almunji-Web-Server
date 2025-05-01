import { Book, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";
import { bookQueryFields } from "./book.constants";

// Service to create a Book
const createBook = async (bookData: Book) => {
  const existingBook = await prisma.book.findFirst({
    where: {
      name: bookData.name,
    },
  });

  if (existingBook) {
    throw new APIError(httpStatus.CONFLICT, "Book name is already taken");
  }

  // Check if the category exists
  const category = await prisma.category.findUnique({
    where: {
      id: bookData.categoryId,
    },
  });

  if (!category) {
    throw new APIError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await prisma.book.create({
    data: bookData,
    select: {
      name: true,
      description: true,
      cover: true,
      category: {
        select: {
          name: true,
        },
      },
      isFeatured: true,
    },
  });

  return result;
};

// Service to get all Books
const getAllBooks = async (options: any, pagination: TPaginationOptions) => {
  const {
    searchTerm,
    isFeatured,
    isDeleted,
    category,
    sortBy,
    sortOrder,
    ...filterData
  } = options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.BookWhereInput[] = [];

  // Convert query param to boolean if present, otherwise default to false
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;
  const isFeaturedQuery =
    isFeatured === "true" ? true : isFeatured === "false" ? false : undefined;

  // Search by only non-deleted tafsir
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  // Search by featured blog
  if (typeof isFeaturedQuery === "boolean") {
    andConditions.push({ isFeatured: isFeaturedQuery });
  }

  // Search by book name and description
  if (searchTerm) {
    andConditions.push({
      OR: bookQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  // Search by book category name
  if (category) {
    andConditions.push({
      category: {
        name: {
          equals: category,
        },
      },
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

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    where: whereConditions,
    select: {
      name: true,
      description: true,
      cover: true,
      category: {
        select: {
          name: true,
        },
      },
      isFeatured: true,
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

  const total = await prisma.book.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Service to get a specific book
const getSingleBook = async (id: string) => {
  const result = await prisma.book.findUniqueOrThrow({
    where: { id: id },
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      isFeatured: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Service to update a book
const updateBook = async (id: string, data: Partial<Book>) => {
  const existingBook = await prisma.book.findUniqueOrThrow({
    where: { id: id },
  });

  if (data.name && data.name !== existingBook.name) {
    const existingName = await prisma.book.findFirst({
      where: { name: data.name },
    });
    if (existingName) {
      throw new APIError(httpStatus.CONFLICT, "Book name is already taken");
    }
  }

  // Update the book
  const result = await prisma.book.update({
    where: { id: id },
    data: {
      name: data.name || existingBook.name,
      description: data.description || existingBook.description,
      cover: data.cover || existingBook.cover,
      categoryId: data.categoryId || existingBook.categoryId,
      isFeatured:
        data.isFeatured !== undefined
          ? data.isFeatured
          : existingBook.isFeatured,
    },
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      isFeatured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Service to delete a book
const deleteBook = async (id: string) => {
  const result = await prisma.book.update({
    where: { id: id },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      isDeleted: true,
    },
  });

  return result;
};

export const bookServices = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
