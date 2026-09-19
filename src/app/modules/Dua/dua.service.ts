import httpStatus from "http-status";

import { Prisma } from "@/generated/prisma/client";

import prisma from "@/utils/prisma";
import { paginationHelper } from "@/utils/paginationHelpers";
import APIError from "@/errors/APIError";

import { duaQueryFields } from "./dua.constants";
import { TDuaQueryFilter } from "./dua.interface";

// Create Dua
const createDua = async (duaData: Prisma.DuaCreateInput) => {
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

// Get All Dua
const getAllDua = async () => {
  return await prisma.dua.findMany({
    where: {
      isDeleted: false,
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get All Dua By Admin
const getAllDuaByAdmin = async (options: TDuaQueryFilter) => {
  const { filters, pagination, additional } = options;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.DuaWhereInput[] = [];

  // Soft delete filter
  const isDeletedQuery = filters?.isDeleted === "true";

  andConditions.push({
    isDeleted: isDeletedQuery,
  });

  // Search by name, Arabic, Bangla, English, etc.
  if (filters?.searchTerm) {
    andConditions.push({
      OR: duaQueryFields.map((field) => ({
        [field]: {
          contains: filters.searchTerm,
        },
      })),
    });
  }

  // Search by tags
  if (filters?.tags) {
    andConditions.push({
      tags: {
        array_contains: [filters.tags],
      },
    });
  }

  // Additional filters
  if (Object.keys(additional).length > 0) {
    andConditions.push({
      AND: Object.keys(additional).map((key) => ({
        [key]: {
          contains: additional[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DuaWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  // Get data
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
        : {
            createdAt: "desc",
          },
  });

  // Count
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

// Get Dua By ID
const getDuaById = async (duaId: string) => {
  return await prisma.dua.findUniqueOrThrow({
    where: {
      id: duaId,
    },
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

// Update Dua
const updateDua = async (duaId: string, duaData: Prisma.DuaUpdateInput) => {
  const existingDua = await prisma.dua.findUnique({
    where: {
      id: duaId,
    },
  });

  if (!existingDua) {
    throw new APIError(httpStatus.NOT_FOUND, "Dua not found");
  }

  return await prisma.dua.update({
    where: {
      id: duaId,
    },
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

// Soft Delete Dua
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

// Hard Delete Dua
const deleteDuaByAdmin = async (id: string) => {
  const existingDua = await prisma.dua.findUnique({
    where: {
      id,
    },
  });

  if (!existingDua) {
    throw new APIError(httpStatus.NOT_FOUND, "Dua not found!");
  }

  return await prisma.dua.delete({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const duaServices = {
  createDua,
  getAllDua,
  getAllDuaByAdmin,
  getDuaById,
  updateDua,
  deleteDua,
  deleteDuaByAdmin,
};
