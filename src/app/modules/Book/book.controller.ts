import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { bookServices } from "./book.service";
import queryPickers from "../../utils/queryPickers";
import { bookFilterableFields, bookSearchableFields } from "./book.constants";

// Controller to create a book
const createBook = catchAsync(async (req, res) => {
  const result = await bookServices.createBook(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added successfully!",
    data: result,
  });
});

const getBooks = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, bookSearchableFields);
  const filters = queryPickers(req.query, bookFilterableFields);

  const result = await bookServices.getBooks(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Controller to get all book
const getAllBooks = catchAsync(async (req, res) => {
  const result = await bookServices.getAllBooks();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All books retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific book
const getSingleBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const result = await bookServices.getSingleBook(bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully!",
    data: result,
  });
});

// Controller to update a book
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

// Controller to delete a book
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
  getBooks,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
