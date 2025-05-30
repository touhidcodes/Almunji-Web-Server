import { Prisma, Para } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { paraQueryFields } from "./para.constants";
import { TParaQueryFilter } from "./para.interface";

// Service to create a new Para
const createPara = async (data: Para) => {
  const existingPara = await prisma.para.findUnique({
    where: { number: data?.number },
  });

  if (existingPara) {
    throw new APIError(httpStatus.CONFLICT, "Para number already exists");
  }

  const result = await prisma.para.create({
    data,
    select: {
      id: true,
      number: true,
      arabic: true,
      english: true,
      bangla: true,
      startAyahRef: true,
      endAyahRef: true,
    },
  });

  return result;
};

// Service to retrieve all Paras
const getAllParas = async () => {
  const result = await prisma.para.findMany({
    select: {
      id: true,
      number: true,
      arabic: true,
      english: true,
      bangla: true,
      startAyahRef: true,
      endAyahRef: true,
    },

    orderBy: { number: "asc" },
  });

  return result;
};

// Service to retrieve all Paras by admins
const getAllParasByAdmin = async (options: TParaQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.ParaWhereInput[] = [];

  // Search by number
  if (filters?.number) {
    andConditions.push({
      number: { equals: Number(filters?.number) },
    });
  }

  // Search by surah name
  if (filters?.searchTerm) {
    andConditions.push({
      OR: paraQueryFields.map((field) => ({
        [field]: {
          contains: filters?.searchTerm,
        },
      })),
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

  const whereConditions: Prisma.ParaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.para.findMany({
    where: whereConditions,
    select: {
      id: true,
      number: true,
      arabic: true,
      english: true,
      bangla: true,
      startAyahRef: true,
      endAyahRef: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { number: "asc" },
  });

  const total = await prisma.para.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
};

// Service to retrieve a specific Para by ID
const getParaById = async (id: string) => {
  const result = await prisma.para.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      number: true,
      english: true,
      arabic: true,
      bangla: true,
      startAyahRef: true,
      endAyahRef: true,
    },
  });

  return result;
};

// Service to update a Para
const updatePara = async (
  id: string,
  data: Partial<Prisma.ParaUpdateInput>
) => {
  const existingPara = await prisma.para.findUnique({
    where: { id },
  });

  if (!existingPara) {
    throw new APIError(httpStatus.NOT_FOUND, "Para not found");
  }

  const result = await prisma.para.update({
    where: { id },
    data,
    select: {
      id: true,
      number: true,
      english: true,
      arabic: true,
      bangla: true,
      startAyahRef: true,
      endAyahRef: true,
    },
  });

  return result;
};

// Service to delete a Para
const deletePara = async (id: string) => {
  const existingPara = await prisma.para.findUnique({
    where: { id },
  });

  if (!existingPara) {
    throw new APIError(httpStatus.NOT_FOUND, "Para not found!");
  }

  return await prisma.$transaction(async (tx) => {
    // delete related ayahs
    await tx.ayah.deleteMany({
      where: {
        paraId: id,
      },
    });

    // then delete para
    const result = await tx.para.delete({
      where: { id },
      select: {
        id: true,
        number: true,
        arabic: true,
        english: true,
        bangla: true,
      },
    });

    return result;
  });
};

export const paraServices = {
  createPara,
  getAllParas,
  getAllParasByAdmin,
  getParaById,
  updatePara,
  deletePara,
};
