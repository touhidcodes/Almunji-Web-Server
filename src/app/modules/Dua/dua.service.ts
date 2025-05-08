import { Dua, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { paginationHelper } from "../../utils/paginationHelpers";
import { duaQueryFields } from "./dua.constants";
import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import { TDuaQueryFilter } from "./dua.interface";

// Service to create a new Dua
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

// Service to get all Dua
const getAllDua = async () => {
  const result = await prisma.dua.findMany({
    where: { isDeleted: false },
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
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Service to get all Dua by admins
const getAllDuaByAdmin = async (options: TDuaQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.DuaWhereInput[] = [];

  // Default to false unless explicitly set to "true" isDeleted filter
  const isDeletedQuery = filters?.isDeleted === "true";
  andConditions.push({ isDeleted: isDeletedQuery });

  // Search by dua heading and text
  if (filters?.searchTerm) {
    andConditions.push({
      OR: duaQueryFields.map((field) => ({
        [field]: {
          contains: filters?.searchTerm,
        },
      })),
    });
  }

  // Search by dua tags
  if (filters?.tags) {
    andConditions.push({
      tags: {
        contains: filters?.tags,
      },
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
        : { createdAt: "desc" },
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

// Service to get specific Dua by ID
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

// Service to update Dua by ID
const updateDua = async (duaId: string, duaData: Partial<Dua>) => {
  const existingDua = await prisma.dua.findUnique({
    where: { id: duaId },
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

// Service to delete a Dua (soft delete)
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

// Service to delete a Dua (hard delete) only by admin
const deleteDuaByAdmin = async (id: string) => {
  const existingDua = await prisma.dua.findUnique({
    where: { id },
  });

  if (!existingDua) {
    throw new APIError(httpStatus.NOT_FOUND, "Dua not found!");
  }

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
  getAllDuaByAdmin,
  getDuaById,
  updateDua,
  deleteDua,
  deleteDuaByAdmin,
};
