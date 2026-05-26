import { Ayah, Dictionary } from "@/generated/prisma/client";
import httpStatus from "http-status";
import APIError from "@/errors/APIError";
import prisma from "@/utils/prisma";
import { TCreatedAyah, TCreatedWord } from "./upload.interface";

// Service to upload dictionary words from a JSON file
const uploadWordsFromFiles = async (data: Partial<Dictionary>[]) => {
  if (!Array.isArray(data)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format!");
  }

  const createdWords: TCreatedWord[] = [];
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

// Service for upload ayahs for a surah from json file
const uploadAyahsFromFiles = async (data: Partial<Ayah>[]) => {
  if (!Array.isArray(data)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format!");
  }

  const createdAyahs: TCreatedAyah[] = [];
  const existingAyahs: string[] = [];

  for (const ayahData of data) {
    const {
      surahId,
      paraId,
      number,
      arabic,
      transliteration = null,
      bangla = null,
      english = null,
    } = ayahData;

    // validation
    if (!surahId || !paraId || typeof number !== "number" || !arabic) {
      continue;
    }

    // UNIQUE CHECK (matches schema)
    const exists = await prisma.ayah.findUnique({
      where: {
        surahId_paraId_number: {
          surahId,
          paraId,
          number,
        },
      },
    });

    if (exists) {
      existingAyahs.push(`${surahId}:${paraId}:${number}`);
      continue;
    }

    const newAyah = await prisma.ayah.create({
      data: {
        surahId,
        paraId,
        number,
        arabic,
        transliteration,
        bangla,
        english,
      },
      select: {
        id: true,
        surahId: true,
        paraId: true,
        number: true,
        arabic: true,
        transliteration: true,
        bangla: true,
        english: true,
      },
    });

    createdAyahs.push(newAyah);
  }

  return {
    createdAyahs,
    existingAyahs,
  };
};

export const uploadServices = {
  uploadWordsFromFiles,
  uploadAyahsFromFiles,
};
