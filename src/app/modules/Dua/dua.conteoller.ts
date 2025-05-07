import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { duaServices } from "./dua.service";
import { duaFilterableFields, duaPaginationFields } from "./dua.constants";
import queryFilters from "../../utils/queryFilters";

// Controller to create a new dua
const createDua = catchAsync(async (req, res) => {
  const result = await duaServices.createDua(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Dua created successfully!",
    data: result,
  });
});

// Controller to get all dua
const getAllDua = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    duaFilterableFields,
    duaPaginationFields
  );

  const result = await duaServices.getAllDua(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific dua by ID
const getDuaById = catchAsync(async (req, res) => {
  const { duaId } = req.params;
  const result = await duaServices.getDuaById(duaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua retrieved successfully!",
    data: result,
  });
});

// Controller to update a dua
const updateDua = catchAsync(async (req, res) => {
  const { duaId } = req.params;
  const result = await duaServices.updateDua(duaId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua updated successfully!",
    data: result,
  });
});

// Controller to delete a dua (soft delete)
const deleteDua = catchAsync(async (req, res) => {
  const { duaId } = req.params;
  const result = await duaServices.deleteDua(duaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua removed successfully!",
    data: result,
  });
});

// Controller to delete a dua (hard delete) only by admin
const deleteDuaByAdmin = catchAsync(async (req, res) => {
  const { duaId } = req.params;
  const result = await duaServices.deleteDuaByAdmin(duaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua deleted successfully!",
    data: result,
  });
});

export const duaControllers = {
  getAllDua,
  getDuaById,
  createDua,
  updateDua,
  deleteDua,
  deleteDuaByAdmin,
};
