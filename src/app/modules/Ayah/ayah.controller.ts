import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { ayahServices } from "./ayah.service";
import queryPickers from "../../utils/queryPickers";
import { ayahFilterableFields, ayahPaginationFields } from "./ayah.constants";

// Controller to create a new Ayah
const createAyah = catchAsync(async (req, res) => {
  const result = await ayahServices.createAyah(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayah created successfully!",
    data: result,
  });
});

// Controller to get all Ayahs with filtering & pagination
const getAllAyahs = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, ayahFilterableFields);
  const pagination = queryPickers(req.query, ayahPaginationFields);
  console.log(req.query);

  const result = await ayahServices.getAllAyahs(options, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayahs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Controller to get a specific Ayah by ID
const getAyahById = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await ayahServices.getAyahById(ayahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayah retrieved successfully!",
    data: result,
  });
});

// Controller to get all Ayah by Para ID
const getAyahsByParaId = catchAsync(async (req, res) => {
  const { paraId } = req.params;
  const result = await ayahServices.getAyahsByParaId(paraId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Para wise ayahs fetched successfully!",
    data: result,
  });
});

// Controller to get all Ayah by Surah ID
const getAyahsBySurahId = catchAsync(async (req, res) => {
  const { surahId } = req.params;
  const result = await ayahServices.getAyahsBySurahId(surahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah wise ayahs fetched successfully!",
    data: result,
  });
});

// Controller to get Ayahs and their Tafsir by Surah ID
const getAyahsAndTafsirBySurahId = catchAsync(async (req, res) => {
  const { surahId } = req.params;
  const result = await ayahServices.getAyahsAndTafsirBySurahId(surahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah wise ayahs fetched successfully!",
    data: result,
  });
});

// Controller to update an Ayah by ID
const updateAyah = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await ayahServices.updateAyah(ayahId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayah updated successfully!",
    data: result,
  });
});

// Controller to delete an Ayah (soft delete)
const deleteAyah = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await ayahServices.deleteAyah(ayahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayah removed successfully!",
    data: result,
  });
});

// Controller to delete an Ayah (hard delete) only by Admin
const deleteAyahByAdmin = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await ayahServices.deleteAyahByAdmin(ayahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ayah deleted successfully!",
    data: result,
  });
});

export const ayahControllers = {
  createAyah,
  getAllAyahs,
  getAyahById,
  getAyahsByParaId,
  getAyahsBySurahId,
  getAyahsAndTafsirBySurahId,
  updateAyah,
  deleteAyah,
  deleteAyahByAdmin,
};
