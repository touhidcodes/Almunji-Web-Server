import { Dua } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

const getDuas = async (options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.dua.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.dua.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getDuaById = async (duaId: string): Promise<Dua | null> => {
  return await prisma.dua.findUnique({
    where: {
      id: duaId,
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
    },
    data: duaData,
  });
};

const deleteDua = async (duaId: string) => {
  return await prisma.dua.delete({
    where: {
      id: duaId,
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
