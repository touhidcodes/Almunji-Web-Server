import { Prisma, Blog } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../utils/paginationHelpers";
import httpStatus from "http-status";
import slugify from "slugify";
import APIError from "../../errors/APIError";

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

const getAllBlogs = async (options: any, pagination: TPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(pagination);
  const { slug, isDeleted, isFeatured, isPublished, sortBy, sortOrder } =
    options;

  const andConditions: Prisma.BlogWhereInput[] = [];

  // Convert query param to boolean if present, otherwise default to false
  const isDeletedQuery =
    typeof isDeleted !== "undefined" ? isDeleted === "true" : undefined;

  // Search by only non-deleted tafsir
  if (isDeletedQuery !== undefined) {
    andConditions.push({
      isDeleted: isDeletedQuery,
    });
  }

  if (slug) {
    andConditions.push({
      slug: {
        equals: slug,
      },
    });
  }

  if (isFeatured !== undefined) {
    andConditions.push({
      IsFeatured: isFeatured,
    });
  }

  if (isPublished !== undefined) {
    andConditions.push({
      isPublished: isPublished,
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

const getBlogById = async (blogId: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  return result;
};

const updateBlog = async (blogId: string, blogData: Partial<Blog>) => {
  const result = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: blogData,
  });
  return result;
};

const deleteBlog = async (blogId: string) => {
  const result = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });
  return result;
};

export const blogServices = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
