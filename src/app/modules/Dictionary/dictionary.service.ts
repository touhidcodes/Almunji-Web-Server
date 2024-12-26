import { Dictionary, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

// Service to create a new dictionary word
const createWord = async (data: Dictionary) => {
  const existingWord = await prisma.dictionary.findUnique({
    where: {
      word: data.word,
    },
  });

  if (existingWord) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Word already exists in the dictionary"
    );
  }

  const wordData = {
    word: data.word,
    description: data.description,
    pronunciation: data.pronunciation,
  };

  const result = await prisma.dictionary.create({
    data: wordData,
    select: {
      id: true,
      word: true,
      description: true,
      pronunciation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getWords = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, isDeleted, ...filterData } = params;

  const andConditions: Prisma.DictionaryWhereInput[] = [];

  // Search by word or description
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          word: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Filter by isDeleted flag
  if (typeof isDeleted !== "undefined") {
    const isDeletedFilter = isDeleted === "true" ? true : false;
    andConditions.push({
      isDeleted: isDeletedFilter,
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

  const whereConditions: Prisma.DictionaryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.dictionary.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.dictionary.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Service to retrieve all dictionary words
const getAllWords = async () => {
  const result = await prisma.dictionary.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      word: true,
      description: true,
      pronunciation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Service to retrieve a specific word by ID
const getWordById = async (id: string) => {
  const result = await prisma.dictionary.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      word: true,
      description: true,
      pronunciation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Service to update a dictionary word
const updateWord = async (id: string, data: Partial<Dictionary>) => {
  const existingWord = await prisma.dictionary.findUniqueOrThrow({
    where: { id },
  });

  if (data.word && data.word !== existingWord.word) {
    const wordConflict = await prisma.dictionary.findUnique({
      where: { word: data.word },
    });

    if (wordConflict) {
      throw new APIError(
        httpStatus.CONFLICT,
        "Word already exists in the dictionary"
      );
    }
  }

  const result = await prisma.dictionary.update({
    where: { id },
    data: {
      word: data.word || existingWord.word,
      description: data.description || existingWord.description,
      pronunciation: data.pronunciation || existingWord.pronunciation,
    },
    select: {
      id: true,
      word: true,
      description: true,
      pronunciation: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Service to delete a dictionary word (soft delete)
const deleteWord = async (id: string) => {
  const result = await prisma.dictionary.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      word: true,
    },
  });

  return result;
};

export const dictionaryServices = {
  createWord,
  getWords,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
};
