//  filter fields
type TBlogFilters = {
  slug?: string;
  isFeatured?: string;
  isPublished?: string;
  isDeleted?: string;
};

//  pagination fields
type TBlogPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicBlogFilters = Record<string, string>;

// Common combined query options type
export type TBlogQueryFilter = {
  filters: TBlogFilters;
  pagination: TBlogPagination;
  additional: TDynamicBlogFilters;
};
