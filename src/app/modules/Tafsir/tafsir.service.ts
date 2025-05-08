import { Prisma, Tafsir } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { tafsirQueryFields } from "./tafsir.constants";
import { TTafsirQueryFilter } from "./tafsir.interface";

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

  // Check if Tafsir already exists for the ayahId
  const existingTafsir = await prisma.tafsir.findUnique({
    where: { ayahId: data.ayahId },
  });

  if (existingTafsir) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Tafsir already exists for this Ayah"
    );
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

// Service to retrieve all Tafsir
const getAllTafsirByAdmin = async (options: TTafsirQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.TafsirWhereInput[] = [];

  // Default to false unless explicitly set to "true" isDeleted filter
  const isDeletedQuery = filters?.isDeleted === "true";
  andConditions.push({ isDeleted: isDeletedQuery });

  // Search by tafsir heading and text
  if (filters?.searchTerm) {
    andConditions.push({
      OR: tafsirQueryFields.map((field) => ({
        [field]: {
          contains: filters?.searchTerm,
        },
      })),
    });
  }

  // Search by tafsir tags
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
          equals: additional[key],
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
        : { createdAt: "desc" },
  });

  const total = await prisma.tafsir.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
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

// Service to delete a Tafsir (soft delete)
const deleteTafsir = async (id: string) => {
  const result = await prisma.tafsir.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      heading: true,
    },
  });
  return result;
};

// Service to delete a Tafsir (hard delete) only by Admin
const deleteTafsirByAdmin = async (id: string) => {
  const existingTafsir = await prisma.tafsir.findUnique({
    where: { id },
  });

  if (!existingTafsir) {
    throw new APIError(httpStatus.NOT_FOUND, "Tafsir not found!");
  }

  const result = await prisma.tafsir.delete({
    where: { id },
    select: {
      id: true,
      heading: true,
    },
  });

  return result;
};

export const tafsirServices = {
  createTafsir,
  getAllTafsirByAdmin,
  getTafsirByAyah,
  getTafsirById,
  updateTafsir,
  deleteTafsir,
  deleteTafsirByAdmin,
};
