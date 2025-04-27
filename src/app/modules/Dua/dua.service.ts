import { Dua, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { duaQueryFields } from "./dua.constants";

// Service to create a new dua
const createDua = async (duaData: Dua) => {
  return await prisma.dua.create({
    data: duaData,
    select: {
      id: true,
      name: true,
      arabic: true,
      transliteration: true,
      bangla: true,
      english: true,
      reference: true,
      tags: true,
    },
  });
};

const getAllDua = async (options: any, pagination: TPaginationOptions) => {
  const { searchTerm, isDeleted, tags, sortBy, sortOrder, ...filterData } =
    options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.DuaWhereInput[] = [];

  // Convert query param to boolean if present, otherwise default to false
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;

  // Search by only non-deleted words
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  // Search by dua heading and text
  if (searchTerm) {
    andConditions.push({
      OR: duaQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  // Search by dua tags
  if (tags) {
    andConditions.push({
      tags: {
        contains: tags,
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

  const whereConditions: Prisma.DuaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.dua.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      arabic: true,
      transliteration: true,
      bangla: true,
      english: true,
      reference: true,
      tags: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "asc" },
  });

  const total = await prisma.dua.count({
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

const getDuaById = async (duaId: string) => {
  return await prisma.dua.findUnique({
    where: {
      id: duaId,
      isDeleted: false,
    },
  });
};

const updateDua = async (duaId: string, duaData: Partial<Dua>) => {
  return await prisma.dua.update({
    where: {
      id: duaId,
      isDeleted: false,
    },
    data: duaData,
  });
};

// Service to delete a dua (soft delete)
const deleteDua = async (duaId: string) => {
  return await prisma.dua.update({
    where: {
      id: duaId,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

// Service to delete a dua (hard delete) only by admin
const deleteDuaByAdmin = async (id: string) => {
  const result = await prisma.dua.delete({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  return result;
};

export const duaServices = {
  createDua,
  getAllDua,
  getDuaById,
  updateDua,
  deleteDua,
  deleteDuaByAdmin,
};
