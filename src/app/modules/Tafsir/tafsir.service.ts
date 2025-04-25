import { Prisma, Tafsir } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TPaginationOptions } from "../../interfaces/pagination";
import { tafsirQueryFields } from "./tafsir.constants";

// Service to create a new Tafsir
const createTafsir = async (data: Tafsir) => {
  // Check if ayahId exists
  const ayah = await prisma.ayah.findFirst({
    where: { id: data.ayahId },
  });

  if (!ayah) {
    console.error("Ayah not found with ID:", data.ayahId);
    throw new APIError(httpStatus.NOT_FOUND, "Ayah not found");
  }

  const result = await prisma.tafsir.create({
    data,
    select: {
      id: true,
      ayah: {
        select: {
          arabic: true,
          bangla: true,
          english: true,
        },
      },
      heading: true,
      summaryBn: true,
      summaryEn: true,
      detailBn: true,
      detailEn: true,
      scholar: true,
      reference: true,
      tags: true,
    },
  });

  return result;
};

// Service to retrieve all Tafsir of a specific Ayah
const getTafsirByAyah = async (ayahId: string) => {
  const result = await prisma.tafsir.findMany({
    where: { ayahId },
    select: {
      id: true,
      ayah: {
        select: {
          arabic: true,
          bangla: true,
          english: true,
        },
      },
      heading: true,
      summaryBn: true,
      summaryEn: true,
      detailBn: true,
      detailEn: true,
      scholar: true,
      reference: true,
      tags: true,
    },
  });

  return result;
};

// Service to retrieve all Tafsir
const getAllTafsir = async (options: any, pagination: TPaginationOptions) => {
  const { searchTerm, isDeleted, tags, sortBy, sortOrder, ...filterData } =
    options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.TafsirWhereInput[] = [];

  // Convert query param to boolean if present, otherwise default to false
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;

  // Search by only non-deleted words
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  // Search by tafsir heading and text
  if (searchTerm) {
    andConditions.push({
      OR: tafsirQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  // Search by tafsir tags
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

  const whereConditions: Prisma.TafsirWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.tafsir.findMany({
    where: whereConditions,
    select: {
      id: true,
      ayah: {
        select: {
          arabic: true,
          bangla: true,
          english: true,
        },
      },
      heading: true,
      summaryBn: true,
      summaryEn: true,
      detailBn: true,
      detailEn: true,
      scholar: true,
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

  const total = await prisma.tafsir.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
};

// Service to retrieve a specific Tafsir by ID
const getTafsirById = async (id: string) => {
  const result = await prisma.tafsir.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      ayah: {
        select: {
          arabic: true,
          bangla: true,
          english: true,
        },
      },
      heading: true,
      summaryBn: true,
      summaryEn: true,
      detailBn: true,
      detailEn: true,
      scholar: true,
      reference: true,
      tags: true,
    },
  });

  return result;
};

// Service to update a Tafsir
const updateTafsir = async (id: string, data: Partial<Tafsir>) => {
  const existingTafsir = await prisma.tafsir.findUnique({
    where: { id },
  });

  if (!existingTafsir) {
    throw new APIError(httpStatus.NOT_FOUND, "Tafsir not found");
  }

  const result = await prisma.tafsir.update({
    where: { id },
    data,
    select: {
      id: true,
      ayah: {
        select: {
          arabic: true,
          bangla: true,
          english: true,
        },
      },
      heading: true,
      summaryBn: true,
      summaryEn: true,
      detailBn: true,
      detailEn: true,
      scholar: true,
      reference: true,
      tags: true,
    },
  });

  return result;
};

// Service to delete a Tafsir
const deleteTafsir = async (id: string) => {
  const existingTafsir = await prisma.tafsir.findUnique({
    where: { id },
  });

  if (!existingTafsir) {
    throw new APIError(httpStatus.NOT_FOUND, "Tafsir not found");
  }

  await prisma.tafsir.delete({
    where: { id },
  });

  return { message: "Tafsir deleted successfully" };
};

export const tafsirServices = {
  createTafsir,
  getAllTafsir,
  getTafsirByAyah,
  getTafsirById,
  updateTafsir,
  deleteTafsir,
};
