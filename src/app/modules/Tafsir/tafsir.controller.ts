import { tafsirServices } from "./tafsir.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import queryPickers from "../../utils/queryPickers";
import {
  tafsirFilterableFields,
  tafsirPaginationFields,
} from "./tafsir.constants";

// Controller to create a new Tafsir
const createTafsir = catchAsync(async (req, res) => {
  const result = await tafsirServices.createTafsir(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir created successfully",
    data: result,
  });
});

// Controller to get all Tafsir
const getAllTafsir = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, tafsirFilterableFields);
  const pagination = queryPickers(req.query, tafsirPaginationFields);

  const result = await tafsirServices.getAllTafsir(options, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir retrieved successfully",
    data: result,
  });
});

// Controller to get all Tafsir of a specific Ayah
const getTafsirByAyah = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await tafsirServices.getTafsirByAyah(ayahId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir retrieved successfully",
    data: result,
  });
});

// Controller to get a specific Tafsir by ID
const getTafsirById = catchAsync(async (req, res) => {
  const { tafsirId } = req.params;
  const result = await tafsirServices.getTafsirById(tafsirId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir retrieved successfully",
    data: result,
  });
});

// Controller to update a Tafsir
const updateTafsir = catchAsync(async (req, res) => {
  const { tafsirId } = req.params;
  const tafsirData = req.body;
  const result = await tafsirServices.updateTafsir(tafsirId, tafsirData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir updated successfully",
    data: result,
  });
});

// Controller to delete a Tafsir
const deleteTafsir = catchAsync(async (req, res) => {
  const { tafsirId } = req.params;
  const result = await tafsirServices.deleteTafsir(tafsirId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir removed successfully",
    data: result,
  });
});

// Controller to delete a tafsir by ID only admins
const deleteTafsirByAdmin = catchAsync(async (req, res) => {
  const { tafsirId } = req.params;
  const result = await tafsirServices.deleteTafsirByAdmin(tafsirId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tafsir deleted successfully!",
    data: result,
  });
});

export const tafsirControllers = {
  createTafsir,
  getAllTafsir,
  getTafsirByAyah,
  getTafsirById,
  updateTafsir,
  deleteTafsir,
  deleteTafsirByAdmin,
};
