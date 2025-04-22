import { Prisma, Tafsir } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

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
      ayahId: true,
      title: true,
      text: true,
      scholar: true,
      reference: true,
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
      title: true,
      text: true,
      scholar: true,
      reference: true,
    },
  });

  return result;
};

// Service to retrieve all Tafsir
const getAllTafsir = async () => {
  const { searchTerm, chapter, sortBy, sortOrder, ...filterData } = options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.SurahWhereInput[] = [];

  // Search by chapter
  if (chapter) {
    andConditions.push({
      chapter: { equals: Number(chapter) } as any,
    });
  }

  // Search by surah name and revelation
  if (searchTerm) {
    andConditions.push({
      OR: surahQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      })),
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

  const whereConditions: Prisma.SurahWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.tafsir.findMany({
    where: whereConditions,
    select: {
      id: true,
      chapter: true,
      totalAyah: true,
      arabic: true,
      english: true,
      bangla: true,
      history: true,
      revelation: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { chapter: "asc" },
  });

  const total = await prisma.surah.count({ where: whereConditions });

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
      title: true,
      text: true,
      scholar: true,
      reference: true,
    },
  });

  return result;
};

// Service to update a Tafsir
const updateTafsir = async (
  id: string,
  data: Partial<Prisma.TafsirUpdateInput>
) => {
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
      ayahId: true,
      title: true,
      text: true,
      scholar: true,
      reference: true,
      createdAt: true,
      updatedAt: true,
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
  getTafsirByAyah,
  getTafsirById,
  updateTafsir,
  deleteTafsir,
};
