import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { bookServices } from "./book.service";
import queryPickers from "../../utils/queryPickers";
import { bookFilterableFields, bookPaginationFields } from "./book.constants";

// Controller to create a Book
const createBook = catchAsync(async (req, res) => {
  const result = await bookServices.createBook(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added successfully!",
    data: result,
  });
});

// Controller to get all Books
const getAllBooks = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, bookFilterableFields);
  const pagination = queryPickers(req.query, bookPaginationFields);

  const result = await bookServices.getAllBooks(options, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Controller to get a specific Book by ID
const getBookById = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.getBookById(bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific Book by slug
const getBookBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await bookServices.getBookBySlug(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully!",
    data: result,
  });
});

// Controller to update a Book
const updateBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.updateBook(bookId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book updated successfully!",
    data: result,
  });
});

// Controller to delete a Book
const deleteBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.deleteBook(bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully!",
    data: result,
  });
});

export const bookControllers = {
  createBook,
  getAllBooks,
  getBookById,
  getBookBySlug,
  updateBook,
  deleteBook,
};
