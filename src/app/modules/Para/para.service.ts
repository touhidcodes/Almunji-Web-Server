import { Prisma, Para } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

// Service to create a new Para
const createPara = async (data: Para) => {
  const result = await prisma.para.create({
    data,
  });

  return result;
};

// Service to retrieve all Paras
const getAllParas = async () => {
  const result = await prisma.para.findMany({
    select: {
      id: true,
      paraNumber: true,
      englishName: true,
      arabicName: true,
      banglaName: true,
    },
  });

  return result;
};

// Service to retrieve a specific Para by ID
const getParaById = async (id: string) => {
  const result = await prisma.para.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      paraNumber: true,
      englishName: true,
      arabicName: true,
      banglaName: true,
    },
  });

  return result;
};

// Service to update a Para
const updatePara = async (
  id: string,
  data: Partial<Prisma.ParaUpdateInput>
) => {
  const existingPara = await prisma.para.findUnique({
    where: { id },
  });

  if (!existingPara) {
    throw new APIError(httpStatus.NOT_FOUND, "Para not found");
  }

  const result = await prisma.para.update({
    where: { id },
    data,
    select: {
      id: true,
      paraNumber: true,
      englishName: true,
      arabicName: true,
      banglaName: true,
    },
  });

  return result;
};

// Service to delete a Para
const deletePara = async (id: string) => {
  const existingPara = await prisma.para.findUnique({
    where: { id },
  });

  if (!existingPara) {
    throw new APIError(httpStatus.NOT_FOUND, "Para not found");
  }

  await prisma.para.delete({
    where: { id },
  });

  return { message: "Para deleted successfully" };
};

export const paraServices = {
  createPara,
  getAllParas,
  getParaById,
  updatePara,
  deletePara,
};
