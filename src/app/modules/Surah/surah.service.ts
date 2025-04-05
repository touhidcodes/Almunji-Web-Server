import { Surah, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

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
  });

  return result;
};

// Service to retrieve Surahs with filtering & pagination
const getAllSurahs = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.SurahWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { arabic: { contains: searchTerm, mode: "insensitive" } as any },
        { english: { contains: searchTerm, mode: "insensitive" } as any },
        { bangla: { contains: searchTerm, mode: "insensitive" } as any },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.SurahWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.surah.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { chapter: "asc" },
  });

  const total = await prisma.surah.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
};

// Service to retrieve a Surah by ID
const getSurahById = async (id: string) => {
  const result = await prisma.surah.findUniqueOrThrow({
    where: { id },
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
  });

  return result;
};

// Service to delete a Surah
const deleteSurah = async (id: string) => {
  const result = await prisma.surah.delete({
    where: { id },
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
