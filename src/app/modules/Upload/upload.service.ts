import { Dictionary, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";

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
};
export const uploadServices = {};
