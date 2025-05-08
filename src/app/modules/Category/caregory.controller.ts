import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { categoryServices } from "./category.service";

// Controller to update a Category
const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

// Controller to get all Category
const getAllCategoriesByAdmin = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoriesByAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All categories retrieved successfully!",
    data: result,
  });
});

// Controller to update a specific Category
const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await categoryServices.updateCategory(categoryId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

// Controller to delete a Category
const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await categoryServices.deleteCategory(categoryId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category removed successfully!",
    data: result,
  });
});

// Controller to delete a Category (Hard Delete) only by Admin
const deleteCategoryByAdmin = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await categoryServices.deleteCategoryByAdmin(categoryId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategoriesByAdmin,
  updateCategory,
  deleteCategory,
  deleteCategoryByAdmin,
};
