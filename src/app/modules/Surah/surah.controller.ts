import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { surahServices } from "./surah.service";
import queryPickers from "../../utils/queryPickers";
import {
  surahFilterableFields,
  surahSearchableFields,
} from "./surah.constants";

// Controller to create a new Surah
const createSurah = catchAsync(async (req, res) => {
  const result = await surahServices.createSurah(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah created successfully!",
    data: result,
  });
});
// Controller to create a new Surah
const createSingleSurah = catchAsync(async (req, res) => {
  const result = await surahServices.createSurah(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah created successfully!",
    data: result,
  });
});

// Controller to get all Surahs with filtering & pagination
const getAllSurahs = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, surahSearchableFields);
  const filters = queryPickers(req.query, surahFilterableFields);

  const result = await surahServices.getAllSurahs(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surahs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Controller to get a specific Surah by ID
const getSurahById = catchAsync(async (req, res) => {
  const { surahId } = req.params;
  const result = await surahServices.getSurahById(surahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah retrieved successfully!",
    data: result,
  });
});

// Controller to update a Surah by ID
const updateSurah = catchAsync(async (req, res) => {
  const { surahId } = req.params;
  const result = await surahServices.updateSurah(surahId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah updated successfully!",
    data: result,
  });
});

// Controller to delete a Surah by ID
const deleteSurah = catchAsync(async (req, res) => {
  const { surahId } = req.params;
  const result = await surahServices.deleteSurah(surahId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Surah deleted successfully!",
    data: result,
  });
});

export const surahControllers = {
  createSurah,
  getAllSurahs,
  getSurahById,
  updateSurah,
  deleteSurah,
};
