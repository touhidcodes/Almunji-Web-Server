import { Prisma, Blog } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import httpStatus from "http-status";
import slugify from "slugify";
import APIError from "../../errors/APIError";

// Service to create a new Blog
const createBlog = async (blogData: Omit<Blog, "slug">) => {
  const generatedSlug = slugify(blogData.title, { lower: true, strict: true });

  const existingBlog = await prisma.blog.findFirst({
    where: { slug: generatedSlug },
  });

  if (existingBlog) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Blog with this title already exists"
    );
  }

  const result = await prisma.blog.create({
    data: {
      ...blogData,
      slug: generatedSlug,
    },
    select: {
      id: true,
      slug: true,
      thumbnail: true,
      title: true,
      summary: true,
      content: true,
    },
  });

  return result;
};

// Service to retrieve all Blog
const getAllBlogs = async (options: any, pagination: TPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);
  const { slug, isPublished, isFeatured, isDeleted, sortBy, sortOrder } =
    options;

  const andConditions: Prisma.BlogWhereInput[] = [];

  // Convert query params to boolean if present
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;
  const isFeaturedQuery =
    isFeatured === "true" ? true : isFeatured === "false" ? false : undefined;
  const isPublishedQuery =
    isPublished === "true" ? true : isPublished === "false" ? false : undefined;

  // Search by published blog
  if (typeof isPublishedQuery === "boolean") {
    andConditions.push({ isPublished: isPublishedQuery });
  }

  // Search by featured blog
  if (typeof isFeaturedQuery === "boolean") {
    andConditions.push({ isFeatured: isFeaturedQuery });
  }

  // Search by non-deleted blog
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  // Search by blog slug
  if (slug) {
    andConditions.push({
      slug: {
        equals: slug,
      },
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    select: {
      id: true,
      slug: true,
      thumbnail: true,
      title: true,
      summary: true,
      content: true,
      isPublished: true,
      isFeatured: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.blog.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Service to retrieve a specific Blog by ID
const getBlogById = async (id: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      slug: true,
      thumbnail: true,
      title: true,
      summary: true,
      content: true,
      isPublished: true,
      isFeatured: true,
    },
  });

  return result;
};

// Service to retrieve a specific Blog by slug
const getBlogBySlug = async (slug: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: { slug },
    select: {
      id: true,
      slug: true,
      thumbnail: true,
      title: true,
      summary: true,
      content: true,
      isPublished: true,
      isFeatured: true,
    },
  });

  return result;
};

// Service to update a Blog
const updateBlog = async (id: string, blogData: Partial<Blog>) => {
  // Block updates to `title` and `slug`
  if ("title" in blogData || "slug" in blogData) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Updating 'title' or 'slug' is not allowed"
    );
  }

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new APIError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const result = await prisma.blog.update({
    where: { id },
    data: blogData,
    select: {
      id: true,
      slug: true,
      thumbnail: true,
      title: true,
      summary: true,
      content: true,
      isPublished: true,
      isFeatured: true,
    },
  });
  return result;
};

// Service to delete a Blog (soft delete)
const deleteBlog = async (id: string) => {
  const result = await prisma.blog.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  });
  return result;
};

// Service to delete a Blog (hard delete) only by Admin
const deleteBlogByAdmin = async (id: string) => {
  const result = await prisma.blog.delete({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
    },
  });
  return result;
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  deleteBlogByAdmin,
};
