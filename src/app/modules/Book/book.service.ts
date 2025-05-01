import { Book, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";
import { bookQueryFields } from "./book.constants";
import slugify from "slugify";

// Service to create a Book
const createBook = async (bookData: Omit<Book, "slug">) => {
  const generatedSlug = slugify(bookData.name, { lower: true, strict: true });

  const existingBook = await prisma.blog.findFirst({
    where: { slug: generatedSlug },
  });

  if (existingBook) {
    throw new APIError(httpStatus.CONFLICT, "Book name is already taken!");
  }

  // Check if the category exists
  const category = await prisma.category.findUnique({
    where: {
      id: bookData.categoryId,
    },
  });

  if (!category) {
    throw new APIError(httpStatus.NOT_FOUND, "Category not found!");
  }

  const result = await prisma.book.create({
    data: { ...bookData, slug: generatedSlug },
    select: {
      name: true,
      slug: true,
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
    slug,
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

  // Search by book slug
  if (slug) {
    andConditions.push({
      slug: {
        equals: slug,
      },
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
      id: true,
      name: true,
      slug: true,
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

// Service to get a specific Book by ID
const getBookById = async (id: string) => {
  const result = await prisma.book.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
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

// Service to get a specific Book by slug
const getBookBySlug = async (slug: string) => {
  const result = await prisma.book.findUniqueOrThrow({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
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

// Service to update a book
const updateBook = async (id: string, bookData: Partial<Book>) => {
  // Block updates to name and slug
  if ("name" in bookData || "slug" in bookData) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Updating name or slug is not allowed!"
    );
  }

  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  // Update the Book
  const result = await prisma.book.update({
    where: { id },
    data: bookData,
    select: {
      id: true,
      name: true,
      slug: true,
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

// Service to delete a Book (Soft Delete)
const deleteBook = async (id: string) => {
  const result = await prisma.book.update({
    where: { id },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return result;
};

// Service to delete a Book (Hard Delete) by Admin
const deleteBookByAdmin = async (id: string) => {
  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await prisma.$transaction([
    prisma.bookContent.deleteMany({
      where: { bookId: id },
    }),

    prisma.book.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return result[1];
};

export const bookServices = {
  createBook,
  getAllBooks,
  getBookById,
  getBookBySlug,
  updateBook,
  deleteBook,
  deleteBookByAdmin,
};
