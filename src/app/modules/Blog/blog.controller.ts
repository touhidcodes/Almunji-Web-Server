import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import queryPickers from "../../utils/queryPickers";
import { blogServices } from "./blog.service";
import { blogFilterableFields, blogPaginationFields } from "./blog.constants";

// Controller to create a new Blog
const createBlog = catchAsync(async (req, res) => {
  const result = await blogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

// Controller to get all Blog
const getAllBlogs = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, blogFilterableFields);
  const pagination = queryPickers(req.query, blogPaginationFields);

  const result = await blogServices.getAllBlogs(options, pagination);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific Blog by ID
const getBlogById = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.getBlogById(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
});

// Controller to get a specific Blog by slug
const getBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await blogServices.getBlogById(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
});

// Controller to update a Blog
const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.updateBlog(blogId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

// Controller to delete (soft delete) a Blog
const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.deleteBlog(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog removed successfully!",
    data: result,
  });
});

// Controller to delete (hard delete) a Blog by ID only admins
const deleteBlogByAdmin = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await blogServices.deleteBlogByAdmin(blogId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const blogControllers = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  deleteBlogByAdmin,
};
