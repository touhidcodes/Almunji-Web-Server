import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

// Service to create a Category
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
    },
  });

  return result;
};

// Service to get all Categories
const getAllCategoriesByAdmin = async () => {
  const result = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return result;
};

// Service to update a specific Category
const updateCategory = async (id: string, data: { name: string }) => {
  const { name } = data;

  const existingCategory = await prisma.category.findUniqueOrThrow({
    where: { id },
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
    },
  });

  return result;
};

// Service to delete a  specific Category (Soft Delete)
const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new APIError(httpStatus.BAD_REQUEST, "Category doesn't exist!");
  }

  const result = await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return result;
};

// Service to delete a  specific Category (Hard Delete) only by Admin
const deleteCategoryByAdmin = async (id: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new APIError(httpStatus.BAD_REQUEST, "Category doesn't exist!");
  }

  const hasBooks = await prisma.book.findFirst({
    where: {
      categoryId: id,
    },
  });

  if (hasBooks) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category. Books exist under this category!"
    );
  }

  const result = await prisma.category.delete({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  return result;
};

export const categoryServices = {
  createCategory,
  getAllCategoriesByAdmin,
  updateCategory,
  deleteCategory,
  deleteCategoryByAdmin,
};
