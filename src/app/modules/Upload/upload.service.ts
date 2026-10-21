import { Ayah, Dictionary, Tafsir } from "@/generated/prisma/client";
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

// Service for upload ayahs with tafsir from json file
const uploadAyahsAndTafsirFromFiles = async (
  data: Array<Partial<Ayah> & { tafsir?: Partial<Tafsir> }>
) => {
  if (!Array.isArray(data)) {
    throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format!");
  }

  const createdAyahs: TCreatedAyah[] = [];
  const existingAyahs: string[] = [];
  const createdTafsirs: Array<{ ayahId: string }> = [];
  const existingTafsirs: string[] = [];

  for (const ayahData of data) {
    const {
      surahId,
      paraId,
      number,
      arabic,
      transliteration = null,
      bangla = null,
      english = null,
      tafsir: tafsirData,
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

      // Check if tafsir exists for existing ayah
      if (tafsirData) {
        const tafsirExists = await prisma.tafsir.findUnique({
          where: { ayahId: exists.id },
        });

        if (tafsirExists) {
          existingTafsirs.push(exists.id);
        } else {
          const {
            heading,
            summaryBn,
            summaryEn,
            detailBn,
            detailEn,
            scholar,
            reference,
            tags,
          } = tafsirData;

          await prisma.tafsir.create({
            data: {
              ayahId: exists.id,
              heading: heading ?? null,
              summaryBn: summaryBn ?? null,
              summaryEn: summaryEn ?? null,
              detailBn: detailBn ?? null,
              detailEn: detailEn ?? null,
              scholar: scholar ?? null,
              reference: reference ?? null,
              tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
            },
          });
          createdTafsirs.push({ ayahId: exists.id });
        }
      }
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

    // Create Tafsir if provided
    if (tafsirData) {
      const {
        heading,
        summaryBn,
        summaryEn,
        detailBn,
        detailEn,
        scholar,
        reference,
        tags,
      } = tafsirData;

      const tafsirExists = await prisma.tafsir.findUnique({
        where: { ayahId: newAyah.id },
      });

      if (!tafsirExists) {
        await prisma.tafsir.create({
          data: {
            ayahId: newAyah.id,
            heading: heading ?? null,
            summaryBn: summaryBn ?? null,
            summaryEn: summaryEn ?? null,
            detailBn: detailBn ?? null,
            detailEn: detailEn ?? null,
            scholar: scholar ?? null,
            reference: reference ?? null,
            tags: tags ? JSON.parse(JSON.stringify(tags)) : null,
          },
        });
        createdTafsirs.push({ ayahId: newAyah.id });
      } else {
        existingTafsirs.push(newAyah.id);
      }
    }
  }

  return {
    createdAyahs,
    existingAyahs,
    createdTafsirs,
    existingTafsirs,
  };
};

export const uploadServices = {
  uploadWordsFromFiles,
  uploadAyahsFromFiles,
  uploadAyahsAndTafsirFromFiles,
};
