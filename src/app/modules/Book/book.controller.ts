import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { bookServices } from "./book.service";
import { bookFilterableFields, bookPaginationFields } from "./book.constants";
import queryFilters from "../../utils/queryFilters";

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
  const result = await bookServices.getAllBooks();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully!",
    data: result,
  });
});

// Controller to get all Books by admins
const getAllBooksByAdmin = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    bookFilterableFields,
    bookPaginationFields
  );

  const result = await bookServices.getAllBooksByAdmin(options);

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

// Controller to get all Books by Category ID
const getBooksByCategoryId = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await bookServices.getBooksByCategoryId(categoryId);
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

// Controller to delete a Book (Soft Delete)
const deleteBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.deleteBook(bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book removed successfully!",
    data: result,
  });
});

// Controller to delete a Book (Hard Delete) by Admin
const deleteBookByAdmin = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.deleteBookByAdmin(bookId);
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
  getAllBooksByAdmin,
  getBookById,
  getBookBySlug,
  getBooksByCategoryId,
  updateBook,
  deleteBook,
  deleteBookByAdmin,
};
