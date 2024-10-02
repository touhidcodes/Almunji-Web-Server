import { Book, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const createBook = async (data: Book) => {
  const existingBook = await prisma.book.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingBook) {
    throw new APIError(httpStatus.CONFLICT, "Book name is already taken");
  }

  const bookData = {
    name: data.name,
    description: data.description,
    cover: data.cover,
    content: data.content,
    categoryId: data.categoryId,
    featured: data.featured || false,
  };

  const result = await prisma.book.create({
    data: bookData,
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      content: true,
      featured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllBooks = async () => {
  const result = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      content: true,
      featured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getSingleBook = async (id: string) => {
  const result = await prisma.book.findUniqueOrThrow({
    where: { id: id },
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      content: true,
      featured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

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
      content: data.content || existingBook.content,
      categoryId: data.categoryId || existingBook.categoryId,
      featured:
        data.featured !== undefined ? data.featured : existingBook.featured,
    },
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      content: true,
      featured: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

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
