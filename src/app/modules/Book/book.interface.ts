//  filter fields
type TBookFilters = {
  searchTerm?: string;
  slug?: string;
  category?: string;
  isFeatured?: string;
  isDeleted?: string;
};

//  pagination fields
type TBookPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicBookFilters = Record<string, string>;

// Common combined query options type
export type TBookQueryFilter = {
  filters: TBookFilters;
  pagination: TBookPagination;
  additional: TDynamicBookFilters;
};
