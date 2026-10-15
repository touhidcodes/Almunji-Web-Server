export interface TDashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalSurahs: number;
  totalParas: number;
  totalAyahs: number;
  totalTafsirs: number;
  totalDictionaries: number;
  activeDictionaries: number;
  totalBooks: number;
  totalBookCategories: number;
  totalBookContents: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalDuas: number;
  totalBookmarks: number;
}

export interface TDashboardStatsWithFilters {
  users: {
    total: number;
    active: number;
    blocked: number;
  };
  surahs: {
    total: number;
  };
  paras: {
    total: number;
  };
  ayahs: {
    total: number;
    withTafsir: number;
  };
  tafsirs: {
    total: number;
  };
  dictionaries: {
    total: number;
    active: number;
    softDeleted: number;
  };
  books: {
    total: number;
    featured: number;
  };
  bookCategories: {
    total: number;
  };
  bookContents: {
    total: number;
  };
  blogs: {
    total: number;
    published: number;
    featured: number;
  };
  duas: {
    total: number;
  };
  bookmarks: {
    total: number;
  };
}
