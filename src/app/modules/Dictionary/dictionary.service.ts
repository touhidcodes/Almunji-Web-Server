import { Dictionary, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

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
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
};
