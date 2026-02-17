import { Dictionary, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import { paginationHelper } from "../../utils/paginationHelpers";
import prisma from "../../utils/prisma";
import { wordQueryFields } from "./dictionary.constants";
import { TWordQueryFilter } from "./dictionary.interface";

// Create Word
const createWord = async (data: Dictionary) => {
  const existingWord = await prisma.dictionary.findUnique({
    where: {
      persianWord: data.persianWord,
    },
  });

  if (existingWord) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Persian word already exists in the dictionary"
    );
  }

  const result = await prisma.dictionary.create({
    data: {
      persianWord: data.persianWord,
      transliteration: data.transliteration,
      banglaMeaning: data.banglaMeaning,
      englishMeaning: data.englishMeaning,
      exampleFA: data.exampleFA,
      exampleEN: data.exampleEN,
      exampleBN: data.exampleBN,
    },
    select: {
      id: true,
      persianWord: true,
      transliteration: true,
      banglaMeaning: true,
      englishMeaning: true,
    },
  });

  return result;
};

// Word Suggestions
const getSuggestion = async (options: TWordQueryFilter) => {
  const { filters, pagination } = options;
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.DictionaryWhereInput[] = [];

  andConditions.push({ isDeleted: false });

  if (filters?.searchTerm) {
    andConditions.push({
      OR: wordQueryFields.map((field) => ({
        [field]: {
          contains: filters.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filters?.persianWord) {
    andConditions.push({
      persianWord: {
        contains: filters.persianWord,
        // mode: "insensitive",
      },
    });
  }

  const whereConditions: Prisma.DictionaryWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.dictionary.findMany({
    where: whereConditions,
    select: {
      id: true,
      persianWord: true,
      transliteration: true,
    },
    skip,
    take: limit,
    orderBy: { persianWord: "asc" },
  });

  const total = await prisma.dictionary.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

//  Get All Words (Admin)
const getAllWordsByAdmin = async (options: TWordQueryFilter) => {
  const { filters, pagination, additional } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.DictionaryWhereInput[] = [];

  const isDeletedQuery = filters?.isDeleted === "true";
  andConditions.push({ isDeleted: isDeletedQuery });

  if (filters?.searchTerm) {
    andConditions.push({
      OR: wordQueryFields.map((field) => ({
        [field]: {
          contains: filters.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(additional).length > 0) {
    andConditions.push({
      AND: Object.entries(additional).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  const whereConditions: Prisma.DictionaryWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.dictionary.findMany({
    where: whereConditions,
    select: {
      id: true,
      persianWord: true,
      transliteration: true,
      banglaMeaning: true,
      englishMeaning: true,
      exampleFA: true,
      exampleEN: true,
      exampleBN: true,
      isDeleted: true,
    },
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { persianWord: "asc" },
    skip,
    take: limit,
  });

  const total = await prisma.dictionary.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Get Word by ID
const getWordById = async (id: string) => {
  const result = await prisma.dictionary.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      persianWord: true,
      transliteration: true,
      banglaMeaning: true,
      englishMeaning: true,
      exampleFA: true,
      exampleEN: true,
      exampleBN: true,
    },
  });

  if (result && (result as any).isDeleted) {
    throw new APIError(httpStatus.NOT_FOUND, "Word not found");
  }

  return result;
};

// Update Word
const updateWord = async (id: string, data: Partial<Dictionary>) => {
  const existingWord = await prisma.dictionary.findUniqueOrThrow({
    where: { id },
  });

  if (data.persianWord && data.persianWord !== existingWord.persianWord) {
    const conflict = await prisma.dictionary.findUnique({
      where: { persianWord: data.persianWord },
    });

    if (conflict) {
      throw new APIError(
        httpStatus.CONFLICT,
        "Persian word already exists in the dictionary"
      );
    }
  }

  const result = await prisma.dictionary.update({
    where: { id },
    data: {
      persianWord: data.persianWord,
      transliteration: data.transliteration,
      banglaMeaning: data.banglaMeaning,
      englishMeaning: data.englishMeaning,
      exampleFA: data.exampleFA,
      exampleEN: data.exampleEN,
      exampleBN: data.exampleBN,
    },
    select: {
      id: true,
      persianWord: true,
      banglaMeaning: true,
      englishMeaning: true,
    },
  });

  return result;
};

// Soft Delete Word
const deleteWord = async (id: string) => {
  return prisma.dictionary.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      persianWord: true,
    },
  });
};

// Hard Delete (Admin)
const deleteWordByAdmin = async (id: string) => {
  const existingWord = await prisma.dictionary.findUnique({ where: { id } });

  if (!existingWord) {
    throw new APIError(httpStatus.NOT_FOUND, "Word not found!");
  }

  return prisma.dictionary.delete({
    where: { id },
    select: {
      id: true,
      persianWord: true,
    },
  });
};

export const dictionaryServices = {
  createWord,
  getSuggestion,
  getAllWordsByAdmin,
  getWordById,
  updateWord,
  deleteWord,
  deleteWordByAdmin,
};
