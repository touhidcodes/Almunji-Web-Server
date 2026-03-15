import { Dictionary } from "@prisma/client";
import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import prisma from "../../utils/prisma";
import { CreatedWord } from "./upload.constants";

// Service to upload dictionary words from a JSON file
const uploadWordsFromFiles = async (data: Partial<Dictionary>[]) => {
  if (!Array.isArray(data)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format!");
  }

  const createdWords: CreatedWord[] = [];
  const existingWords: string[] = [];

  for (const wordData of data) {
    const {
      persianWord,
      banglaMeaning = "-",
      transliteration = "-",
    } = wordData;

    // Skip if word is not provided
    if (
      !persianWord ||
      typeof persianWord !== "string" ||
      persianWord.trim() === ""
    ) {
      continue;
    }

    // Check if word already exists
    const existingWord = await prisma.dictionary.findUnique({
      where: { persianWord },
    });

    if (existingWord) {
      existingWords.push(persianWord);
      continue;
    }

    // Create new dictionary entry
    const newWord = await prisma.dictionary.create({
      data: { persianWord, banglaMeaning, transliteration },
      select: {
        id: true,
        persianWord: true,
        banglaMeaning: true,
        transliteration: true,
      },
    });
    createdWords.push(newWord);
  }

  return { createdWords, existingWords };
};

export const uploadServices = { uploadWordsFromFiles };
