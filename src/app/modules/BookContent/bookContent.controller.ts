import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import queryPickers from "../../utils/queryPickers";
import { bookContentServices } from "./bookContent.service";
import {
  bookContentFilterableFields,
  bookContentPaginationFields,
} from "./BookContent.constants";

// Create a Book Content
const createBookContent = catchAsync(async (req, res) => {
  const result = await bookContentServices.createBookContent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content added successfully!",
    data: result,
  });
});

// Get all Book Contents
const getAllBookContent = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, bookContentFilterableFields);
  const pagination = queryPickers(req.query, bookContentPaginationFields);
  const result = await bookContentServices.getAllBookContents(
    options,
    pagination
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book contents retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get a single Book Content by ID
const getBookContentById = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const result = await bookContentServices.getBookContentById(contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content retrieved successfully!",
    data: result,
  });
});

// Get a single Book index Content by ID
const getBookIndexByBookId = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookContentServices.getBookIndexByBookId(bookId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book index retrieved successfully!",
    data: result,
  });
});

// Get a single Book Content by ID
const getContentsByBookId = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookContentServices.getContentsByBookId(bookId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content retrieved successfully!",
    data: result,
  });
});

// Update Book Content
const updateBookContent = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const result = await bookContentServices.updateBookContent(
    contentId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content updated successfully!",
    data: result,
  });
});

// Soft Delete Book Content
const deleteBookContent = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const result = await bookContentServices.deleteBookContent(contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content removed successfully!",
    data: result,
  });
});

// Hard Delete Book Content (Admin only)
const deleteBookContentByAdmin = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const result = await bookContentServices.deleteBookContentByAdmin(contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book content deleted successfully!",
    data: result,
  });
});

export const bookContentControllers = {
  createBookContent,
  getAllBookContent,
  getBookContentById,
  getBookIndexByBookId,
  getContentsByBookId,
  updateBookContent,
  deleteBookContent,
  deleteBookContentByAdmin,
};
