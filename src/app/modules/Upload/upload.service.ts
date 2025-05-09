import { Dictionary } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { CreatedWord } from "./upload.constants";

// Service to upload dictionary words from a JSON file
const uploadWordsFromFiles = async (data: Partial<Dictionary>[]) => {
  if (!Array.isArray(data)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format!");
  }

  const createdWords: CreatedWord[] = [];
  const existingWords: string[] = [];

  for (const wordData of data) {
    const { word, definition = "-", pronunciation = "-" } = wordData;

    // Skip if word is not provided
    if (!word || typeof word !== "string" || word.trim() === "") {
      continue;
    }

    // Check if word already exists
    const existingWord = await prisma.dictionary.findUnique({
      where: { word },
    });

    if (existingWord) {
      existingWords.push(word);
      continue;
    }

    // Create new dictionary entry
    const newWord = await prisma.dictionary.create({
      data: { word, definition, pronunciation },
      select: {
        id: true,
        word: true,
        definition: true,
        pronunciation: true,
      },
    });
    createdWords.push(newWord);
  }

  return { createdWords, existingWords };
};

export const uploadServices = { uploadWordsFromFiles };
