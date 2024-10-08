import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { bookServices } from "./book.service";

const createBook = catchAsync(async (req, res) => {
  const result = await bookServices.createBook(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book added successfully!",
    data: result,
  });
});

const getAllBooks = catchAsync(async (req, res) => {
  const result = await bookServices.getAllBooks();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All books retrieved successfully!",
    data: result,
  });
});

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
  getSingleBook,
  updateBook,
  deleteBook,
};
