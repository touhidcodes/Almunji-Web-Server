import { UserRole } from "@/generated/prisma/enums";
import prisma from "@/utils/prisma";
import { TDashboardStats } from "./dashboard.interface";

// Get Dashboard Stats
const getDashboardStats = async (
  role: UserRole,
  userId: string
): Promise<TDashboardStats> => {
  // Use Promise.all to execute all queries in parallel (minimal token consumption)
  const [
    totalUsersResult,
    activeUsers,
    blockedUsers,
    totalSurahs,
    totalParas,
    totalAyahs,
    totalTafsirs,
    totalDictionaries,
    activeDictionaries,
    totalBooks,
    totalBookCategories,
    totalBookContents,
    totalBlogs,
    publishedBlogs,
    featuredBlogs,
    totalDuas,
    totalBookmarks,
    bookmarkedAyahs,
    bookmarkedDuas,
    featuredBooks,
  ] = await Promise.all([
    // User stats
    prisma.user.aggregate({
      _count: true,
    }),
    prisma.user.count({
      where: { status: "ACTIVE" },
    }),
    prisma.user.count({
      where: { status: "BLOCKED" },
    }),
    // Surah stats
    prisma.surah.count(),
    // Para stats
    prisma.para.count(),
    // Ayah stats
    prisma.ayah.count(),
    // Tafsir stats
    prisma.tafsir.count(),
    // Dictionary stats
    prisma.dictionary.count(),
    prisma.dictionary.count({
      where: { isDeleted: false },
    }),
    // Book stats
    prisma.book.count(),
    prisma.bookCategories.count(),
    prisma.bookContent.count(),
    prisma.book.count({
      where: { isFeatured: true },
    }),
    // Blog stats
    prisma.blog.count(),
    prisma.blog.count({
      where: { isPublished: true },
    }),
    prisma.blog.count({
      where: { isFeatured: true },
    }),
    // Dua stats
    prisma.dua.count(),
    // Bookmark stats
    prisma.bookmark.count(),
    prisma.bookmark.count({
      where: { itemType: "AYAH" },
    }),
    prisma.bookmark.count({
      where: { itemType: "DUA" },
    }),
  ]);

  return {
    totalUsers: totalUsersResult._count,
    activeUsers,
    blockedUsers,
    totalSurahs,
    totalParas,
    totalAyahs,
    totalTafsirs,
    totalDictionaries,
    activeDictionaries,
    totalBooks,
    totalBookCategories,
    totalBookContents,
    totalBlogs,
    publishedBlogs,
    featuredBlogs,
    totalDuas,
    totalBookmarks,
    bookmarkedAyahs,
    bookmarkedDuas,
    featuredBooks,
  };
};

export const dashboardServices = {
  getDashboardStats,
};
