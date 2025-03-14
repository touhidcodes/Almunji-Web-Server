import { Dua } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

const getDuas = async (options: TPaginationOptions) => {
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

const createDua = async (duaData: Dua) => {
  return await prisma.dua.create({
    data: duaData,
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

const deleteDua = async (duaId: string) => {
  return await prisma.dua.update({
    where: {
      id: duaId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const duaServices = {
  getDuas,
  getDuaById,
  createDua,
  updateDua,
  deleteDua,
};
