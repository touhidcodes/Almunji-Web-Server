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
    totalDuas,
    totalBookmarks,
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
    prisma.bookCategory.count(),
    prisma.bookContent.count(),
    // Blog stats
    prisma.blog.count(),
    prisma.blog.count({
      where: { isPublished: true },
    }),
    // Dua stats
    prisma.dua.count(),
    // Bookmark stats
    prisma.bookmark.count(),
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
    totalDuas,
    totalBookmarks,
  };
};

export const dashboardServices = {
  getDashboardStats,
};
