import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import queryPickers from "../../utils/queryPickers";
import { duaServices } from "./dua.service";

const getDuas = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);
  const result = await duaServices.getDuas(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Duas retrieved successfully!",
    data: result,
  });
});

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

const createDua = catchAsync(async (req, res) => {
  const result = await duaServices.createDua(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Dua created successfully!",
    data: result,
  });
});

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

const deleteDua = catchAsync(async (req, res) => {
  const { duaId } = req.params;
  const result = await duaServices.deleteDua(duaId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dua deleted successfully!",
    data: result,
  });
});

export const duaControllers = {
  getDuas,
  getDuaById,
  createDua,
  updateDua,
  deleteDua,
};
