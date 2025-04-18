import { Dictionary, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import { wordFilterableFields, wordQueryFields } from "./dictionary.constants";

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
    definition: data.definition,
    pronunciation: data.pronunciation,
  };

  const result = await prisma.dictionary.create({
    data: wordData,
    select: {
      id: true,
      word: true,
      definition: true,
      pronunciation: true,
    },
  });

  return result;
};

// Service to suggestion dictionary words
const getSuggestion = async (options: any, pagination: TPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);
  const { searchTerm, query, ...filterData } = options;

  const andConditions: Prisma.DictionaryWhereInput[] = [];

  // Search by only non-deleted words
  andConditions.push({
    isDeleted: false,
  });

  // Search by word suggestion
  if (query) {
    andConditions.push({
      word: {
        contains: query.toLowerCase(),
      },
    });
  }

  // Search by word or description
  if (searchTerm) {
    andConditions.push({
      OR: wordQueryFields.map((field) => ({
        [field]: {
          contains: searchTerm.toLowerCase(),
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

  const whereConditions: Prisma.DictionaryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.dictionary.findMany({
    where: whereConditions,
    select: { word: true, definition: true, pronunciation: true },
    orderBy: { word: "asc" },
    skip,
    take: limit,
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

// Service to retrieve all dictionary words with optional isDeleted filter
const getAllWords = async (options: any, pagination: TPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);

  // Convert query param to boolean if present, otherwise default to false
  const isDeleted =
    typeof options.isDeleted !== "undefined"
      ? options.isDeleted === "true"
      : false;

  const result = await prisma.dictionary.findMany({
    where: { isDeleted },
    select: {
      id: true,
      word: true,
      definition: true,
      pronunciation: true,
    },
    orderBy: { word: "asc" },
    skip,
    take: limit,
  });

  const total = await prisma.dictionary.count({
    where: { isDeleted },
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

// Service to retrieve a specific word by ID
const getWordById = async (id: string) => {
  const result = await prisma.dictionary.findUniqueOrThrow({
    where: { id, isDeleted: false },
    select: {
      id: true,
      word: true,
      definition: true,
      pronunciation: true,
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
      definition: data.definition || existingWord.definition,
      pronunciation: data.pronunciation || existingWord.pronunciation,
    },
    select: {
      id: true,
      word: true,
      definition: true,
      pronunciation: true,
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

// Service to delete a dictionary word (hard delete) only by admin
const deleteWordByAdmin = async (id: string) => {
  const result = await prisma.dictionary.delete({
    where: { id },
  });

  return result;
};

export const dictionaryServices = {
  createWord,
  getSuggestion,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
  deleteWordByAdmin,
};
