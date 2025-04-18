import { Ayah, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { ayahQueryFields } from "./ayah.constants";

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
  if (data.number > surah.totalAyah) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      `Ayah number exceeds the total number of ayahs (${surah.totalAyah}) in this Surah`
    );
  }

  const existingAyah = await prisma.ayah.findUnique({
    where: {
      surahId_paraId_number: {
        surahId: data.surahId,
        paraId: data.paraId,
        number: data.number,
      },
    },
  });

  if (existingAyah) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Ayah number already exists in this Surah"
    );
  }

  const result = await prisma.ayah.create({
    data,
    select: {
      surahId: true,
      paraId: true,
      number: true,
      arabic: true,
      transliteration: true,
      bangla: true,
      english: true,
    },
  });

  return result;
};

// Service to retrieve Ayahs with filtering & pagination
const getAllAyahs = async (options: any, pagination: TPaginationOptions) => {
  const { searchTerm, number, ...filterData } = options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.AyahWhereInput[] = [];

  // Search by number
  if (number) {
    andConditions.push({
      number: { equals: Number(number) } as any,
    });
  }

  // Search by ayah
  if (searchTerm) {
    andConditions.push({
      OR: ayahQueryFields.map((field) => ({
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

  const whereConditions: Prisma.AyahWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.ayah.findMany({
    where: whereConditions,
    select: {
      id: true,
      number: true,
      arabic: true,
      transliteration: true,
      bangla: true,
      english: true,
      surah: {
        select: {
          chapter: true,
          arabic: true,
          english: true,
          bangla: true,
        },
      },
      para: {
        select: {
          number: true,
          arabic: true,
          english: true,
          bangla: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: { number: "asc" },
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
const updateAyah = async (
  id: string,
  data: Omit<Partial<Ayah>, "surahId" | "ayahNumber">
) => {
  // Fetch the existing Ayah
  const existingAyah = await prisma.ayah.findUniqueOrThrow({ where: { id } });

  if (!existingAyah) {
    throw new APIError(httpStatus.NOT_FOUND, "Ayah not found");
  }

  // Ensure surahId and ayahNumber are not modified
  if ("surahId" in data || "ayahNumber" in data) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Modification of surahId and ayahNumber is not allowed"
    );
  }

  // Perform update with only allowed fields
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
