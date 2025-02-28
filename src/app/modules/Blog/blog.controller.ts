import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { categoryServices } from "./category.service";

// Controller to update a category
const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

// Controller to get all category
const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All categories retrieved successfully!",
    data: result,
  });
});

// Controller to update a specific category
const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.user;

  const result = await categoryServices.updateCategory(categoryId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

// Controller to delete a category
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await categoryServices.deleteCategory(categoryId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
