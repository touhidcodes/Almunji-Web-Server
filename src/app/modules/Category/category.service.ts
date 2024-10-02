import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const createCategory = async (data: { name: string; description?: string }) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new APIError(httpStatus.CONFLICT, "Category name is already taken");
  }

  const categoryData = {
    name: data.name,
  };

  const result = await prisma.category.create({
    data: categoryData,
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const updateCategory = async (id: string, data: { name: string }) => {
  const { name } = data;

  const existingCategory = await prisma.category.findUniqueOrThrow({
    where: { id: id },
  });

  if (name && name !== existingCategory.name) {
    const existingName = await prisma.category.findUnique({
      where: { name: name },
    });
    if (existingName) {
      throw new APIError(httpStatus.CONFLICT, "Category name is already taken");
    }
  }

  const result = await prisma.category.update({
    where: { id: id },
    data: {
      name: name || existingCategory.name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id: id },
    select: {
      id: true,
      name: true,
    },
  });

  return result;
};

export const categoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
