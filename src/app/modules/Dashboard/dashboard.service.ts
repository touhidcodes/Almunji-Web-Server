import { UserRole } from "@/generated/prisma/enums";
import prisma from "@/utils/prisma";
import { TDashboardStats } from "./dashboard.interface";

// Get Dashboard Stats
const getDashboardStats = async (
  role: UserRole,
  userId: string
): Promise<TDashboardStats> => {
  // For SUPERADMIN and ADMIN: return all stats
  if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN) {
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
  }

  // For MODERATOR: Check permissions and return stats only for accessible resources
  // Use a single permission check to get all user permissions
  const userPermissions = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: true },
  });

  const userPermissionMap = new Map(
    userPermissions.map((up) => [
      `${up.permission.resource}:${up.permission.action}`,
      up,
    ])
  );

  // Helper function to check if user has permission
  const hasPermission = (resource: string, action: string) =>
    userPermissionMap.has(`${resource}:${action}`);

  // Fetch stats only for resources where moderator has READ permission
  const [
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
    hasPermission("SURAH", "READ") ? prisma.surah.count() : 0,
    hasPermission("PARA", "READ") ? prisma.para.count() : 0,
    hasPermission("AYAH", "READ") ? prisma.ayah.count() : 0,
    hasPermission("TAFSIR", "READ") ? prisma.tafsir.count() : 0,
    hasPermission("DICTIONARY", "READ") ? prisma.dictionary.count() : 0,
    hasPermission("DICTIONARY", "READ")
      ? prisma.dictionary.count({ where: { isDeleted: false } })
      : 0,
    hasPermission("BOOK", "READ") ? prisma.book.count() : 0,
    hasPermission("BOOKCATEGORY", "READ") ? prisma.bookCategories.count() : 0,
    hasPermission("BOOKCONTENT", "READ") ? prisma.bookContent.count() : 0,
    hasPermission("BLOG", "READ") ? prisma.blog.count() : 0,
    hasPermission("BLOG", "READ")
      ? prisma.blog.count({ where: { isPublished: true } })
      : 0,
    hasPermission("BLOG", "READ")
      ? prisma.blog.count({ where: { isFeatured: true } })
      : 0,
    hasPermission("DUA", "READ") ? prisma.dua.count() : 0,
    hasPermission("BOOKMARK", "READ") ? prisma.bookmark.count() : 0,
    hasPermission("BOOKMARK", "READ")
      ? prisma.bookmark.count({ where: { itemType: "AYAH" } })
      : 0,
    hasPermission("BOOKMARK", "READ")
      ? prisma.bookmark.count({ where: { itemType: "DUA" } })
      : 0,
    hasPermission("BOOK", "READ")
      ? prisma.book.count({ where: { isFeatured: true } })
      : 0,
  ]);

  return {
    totalUsers: 0, // Moderators can't access user stats
    activeUsers: 0,
    blockedUsers: 0,
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
