import { BookContent, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";

// Create book content
const createBookContent = async (data: BookContent) => {
  const book = await prisma.book.findUnique({
    where: { id: data.bookId },
  });

  if (!book) {
    throw new APIError(httpStatus.NOT_FOUND, "Book not found!");
  }

  const result = await prisma.bookContent.create({
    data,
  });

  return result;
};

// Get all book contents
const getAllBookContents = async (
  filters: any,
  pagination: TPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const result = await prisma.bookContent.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.bookContent.count({ where: filters });

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
