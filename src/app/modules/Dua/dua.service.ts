import { Dua } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

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

const getAllDua = async (options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.dua.findMany({
    where: {
      isDeleted: false,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.dua.count({
    where: {
      isDeleted: false,
    },
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
