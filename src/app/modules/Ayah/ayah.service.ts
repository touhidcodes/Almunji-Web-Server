import { Ayah, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

// Service to create a new Ayah
const createAyah = async (data: Ayah) => {
  // Fetch the surah to get the total ayah count
  const surah = await prisma.surah.findUnique({
    where: { id: data.surahId },
    select: { totalAyah: true },
  });

  if (!surah) {
    throw new APIError(httpStatus.NOT_FOUND, "Surah not found");
  }

  // Validate ayahNumber does not exceed totalAyah
  if (data.ayahNumber > surah.totalAyah) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      `Ayah number exceeds the total number of ayahs (${surah.totalAyah}) in this Surah`
    );
  }

  const existingAyah = await prisma.ayah.findUnique({
    where: {
      surahId_ayahNumber: {
        surahId: data.surahId,
        ayahNumber: data.ayahNumber,
      },
    },
  });

  if (existingAyah) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Ayah number already exists in this Surah"
    );
  }

  const result = await prisma.ayah.create({ data });

  return result;
};

// Service to retrieve Ayahs with filtering & pagination
const getAllAyahs = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.AyahWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { arabicText: { contains: searchTerm, mode: "insensitive" } as any },
        { banglaText: { contains: searchTerm, mode: "insensitive" } as any },
        { englishText: { contains: searchTerm, mode: "insensitive" } as any },
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

  const whereConditions: Prisma.AyahWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.ayah.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { tafsir: true, surah: true }, // Include Tafsir and Surah relations
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { ayahNumber: "asc" },
  });

  const total = await prisma.ayah.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
};

// Service to retrieve an Ayah by ID
const getAyahById = async (id: string) => {
  const result = await prisma.ayah.findUniqueOrThrow({
    where: { id },
  });

  return result;
};

// Service to update an Ayah
const updateAyah = async (id: string, data: Partial<Ayah>) => {
  const existingAyah = await prisma.ayah.findUniqueOrThrow({ where: { id } });

  if (data.ayahNumber && data.ayahNumber !== existingAyah.ayahNumber) {
    const ayahConflict = await prisma.ayah.findUnique({
      where: {
        surahId_ayahNumber: {
          surahId: existingAyah.surahId,
          ayahNumber: data.ayahNumber,
        },
      },
    });

    if (ayahConflict) {
      throw new APIError(
        httpStatus.CONFLICT,
        "Ayah number already exists in this Surah"
      );
    }
  }

  const result = await prisma.ayah.update({
    where: { id },
    data,
  });

  return result;
};

// Service to delete an Ayah
const deleteAyah = async (id: string) => {
  const result = await prisma.ayah.delete({
    where: { id },
  });

  return result;
};

export const ayahServices = {
  createAyah,
  getAllAyahs,
  getAyahById,
  updateAyah,
  deleteAyah,
};
