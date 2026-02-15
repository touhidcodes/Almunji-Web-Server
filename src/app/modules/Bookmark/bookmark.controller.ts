import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookmarkServices } from "./bookmark.service";

// Create a bookmark
const createBookmark = catchAsync(async (req, res) => {
  const userId = req.user.id; // from auth middleware

  const result = await bookmarkServices.createBookmark({
    userId,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bookmark created successfully!",
    data: result,
  });
});

// Get all bookmarks of logged-in user
const getMyBookmarks = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await bookmarkServices.getMyBookmarks(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmarks retrieved successfully!",
    data: result,
  });
});

// Get single bookmark by ID (user scoped)
const getSingleBookmark = catchAsync(async (req, res) => {
  const { bookmarkId } = req.params;
  const userId = req.user.id;

  const result = await bookmarkServices.getSingleBookmark(bookmarkId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark retrieved successfully!",
    data: result,
  });
});

// Remove bookmark
const deleteBookmark = catchAsync(async (req, res) => {
  const { bookmarkId } = req.params;
  const userId = req.user.id;

  const result = await bookmarkServices.deleteBookmark(bookmarkId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark removed successfully!",
    data: result,
  });
});

// Get all bookmarks
const getAllBookmarksByAdmin = catchAsync(async (req, res) => {
  const result = await bookmarkServices.getAllBookmarksByAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookmarks retrieved successfully!",
    data: result,
  });
});

// Hard delete bookmark
const deleteBookmarkByAdmin = catchAsync(async (req, res) => {
  const { bookmarkId } = req.params;

  const result = await bookmarkServices.deleteBookmarkByAdmin(bookmarkId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark deleted successfully!",
    data: result,
  });
});

export const bookmarkControllers = {
  createBookmark,
  getMyBookmarks,
  getSingleBookmark,
  deleteBookmark,
  getAllBookmarksByAdmin,
  deleteBookmarkByAdmin,
};
