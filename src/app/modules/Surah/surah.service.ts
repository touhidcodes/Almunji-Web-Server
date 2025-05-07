import { Surah, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { surahQueryFields } from "./surah.constants";
import { TSurahQueryFilter } from "./surah.interface";

// Service to create a new Surah
const createSurah = async (data: Surah) => {
  const existingSurah = await prisma.surah.findUnique({
    where: { chapter: data?.chapter },
  });

  if (existingSurah) {
    throw new APIError(httpStatus.CONFLICT, "Surah chapter already exists");
  }

  const result = await prisma.surah.create({
    data,
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
  });

  return result;
};

// Service to retrieve Surahs
const getAllSurahs = async () => {
  const result = await prisma.surah.findMany({
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

    orderBy: { chapter: "asc" },
  });
  return result;
};

// Service to retrieve Surahs with filtering & pagination
const getAllSurahsByAdmin = async (options: TSurahQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.SurahWhereInput[] = [];

  // Search by chapter
  if (filters?.chapter) {
    andConditions.push({
      chapter: { equals: Number(filters?.chapter) },
    });
  }

  // Search by surah name and revelation
  if (filters?.searchTerm) {
    andConditions.push({
      OR: surahQueryFields.map((field) => ({
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

  const whereConditions: Prisma.SurahWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.surah.findMany({
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

// Service to retrieve a Surah by ID
const getSurahById = async (id: string) => {
  const result = await prisma.surah.findUniqueOrThrow({
    where: { id },
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
  });

  return result;
};

// Service to update a Surah
const updateSurah = async (id: string, data: Partial<Surah>) => {
  const existingSurah = await prisma.surah.findUniqueOrThrow({ where: { id } });

  if (data.chapter && data.chapter !== existingSurah.chapter) {
    const chapterConflict = await prisma.surah.findUnique({
      where: { chapter: data.chapter },
    });
    if (chapterConflict) {
      throw new APIError(httpStatus.CONFLICT, "Surah chapter already exists");
    }
  }

  const result = await prisma.surah.update({
    where: { id },
    data,
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
  });

  return result;
};

// Service to delete a Surah
const deleteSurah = async (id: string) => {
  const existingSurah = await prisma.surah.findUnique({
    where: { id },
  });

  if (!existingSurah) {
    throw new APIError(httpStatus.NOT_FOUND, "Surah not found!");
  }

  return await prisma.$transaction(async (tx) => {
    // delete related ayahs
    await tx.ayah.deleteMany({
      where: {
        surahId: id,
      },
    });

    // then delete surah
    const result = await tx.surah.delete({
      where: { id },
      select: {
        id: true,
        chapter: true,
        arabic: true,
        english: true,
        bangla: true,
      },
    });

    return result;
  });
};

export const surahServices = {
  createSurah,
  getAllSurahs,
  getAllSurahsByAdmin,
  getSurahById,
  updateSurah,
  deleteSurah,
};
