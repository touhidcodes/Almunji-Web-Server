// import { Dictionary, Prisma } from "@prisma/client";
// import prisma from "../../utils/prisma";
// import APIError from "../../errors/APIError";
// import httpStatus from "http-status";
// import { TPaginationOptions } from "../../interfaces/pagination";
// import { paginationHelper } from "../../utils/paginationHelpers";

// // Service to retrieve all dictionary words
// const getAllWords = async () => {
//   const result = await prisma.dictionary.findMany({
//     where: { isDeleted: false },
//     select: {
//       id: true,
//       word: true,
//       description: true,
//       pronunciation: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
// };
// export const uploadServices = { getAllWords };

import { Dictionary, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import fs from "fs";
import { IUploadFile } from "../../interfaces/file";

// Service to upload dictionary words from a JSON file
const uploadWordsFromFiles = async (data: Partial<Dictionary>[]) => {
  try {
    if (!Array.isArray(data)) {
      throw new APIError(httpStatus.BAD_REQUEST, "Invalid file format");
    }

    const createdWords: Dictionary[] = [];
    const existingWords: string[] = [];

    for (const wordData of data) {
      const { word, description, pronunciation } = wordData;

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
        data: { word, description, pronunciation },
        select: {
          id: true,
          word: true,
          description: true,
          pronunciation: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      createdWords.push(newWord);
    }

    return {
      success: true,
      message: "Dictionary words uploaded successfully",
      createdWords,
      existingWords,
    };
  } catch (error) {
    throw new APIError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error processing file"
    );
  }
};

export const uploadServices = { uploadWordsFromFiles };
