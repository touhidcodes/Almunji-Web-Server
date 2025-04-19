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

// Controller to delete an Ayah by ID
const deleteAyah = catchAsync(async (req, res) => {
  const { ayahId } = req.params;
  const result = await ayahServices.deleteAyah(ayahId);
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
  updateAyah,
  deleteAyah,
};
