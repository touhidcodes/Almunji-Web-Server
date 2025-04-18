import { Surah, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { surahQueryFields } from "./surah.constants";

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

// Service to retrieve Surahs with filtering & pagination
const getAllSurahs = async (options: any, pagination: TPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);
  const { searchTerm, chapter, ...filterData } = options;

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
    orderBy: { chapter: "asc" },
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
  const result = await prisma.surah.delete({
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
};

export const surahServices = {
  createSurah,
  getAllSurahs,
  getSurahById,
  updateSurah,
  deleteSurah,
};
