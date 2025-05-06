import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { paraServices } from "./para.service";
import queryPickers from "../../utils/queryPickers";
import { paraFilterableFields, paraPaginationFields } from "./para.constants";
import queryFilters from "../../utils/queryFilters";

// Controller to create a new Para
const createPara = catchAsync(async (req, res) => {
  const result = await paraServices.createPara(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Para created successfully",
    data: result,
  });
});

// Controller to get all Paras
const getAllParas = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    paraFilterableFields,
    paraPaginationFields
  );

  const result = await paraServices.getAllParas(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Paras retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific Para by ID
const getParaById = catchAsync(async (req, res) => {
  const { paraId } = req.params;
  const result = await paraServices.getParaById(paraId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Para retrieved successfully!",
    data: result,
  });
});

// Controller to update a Para
const updatePara = catchAsync(async (req, res) => {
  const { paraId } = req.params;
  const paraData = req.body;
  const result = await paraServices.updatePara(paraId, paraData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Para updated successfully!",
    data: result,
  });
});

// Controller to delete a Para
const deletePara = catchAsync(async (req, res) => {
  const { paraId } = req.params;
  const result = await paraServices.deletePara(paraId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Para deleted successfully!",
    data: result,
  });
});

export const paraControllers = {
  createPara,
  getAllParas,
  getParaById,
  updatePara,
  deletePara,
};
