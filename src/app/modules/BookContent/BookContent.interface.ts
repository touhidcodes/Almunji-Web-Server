//  filter fields
type TBookContentFilters = {
  searchTerm?: string;
  isDeleted?: string;
};

//  pagination fields
type TBookContentPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicBookContentFilters = Record<string, string>;

// Common combined query options type
export type TBookContentQueryFilter = {
  filters: TBookContentFilters;
  pagination: TBookContentPagination;
  additional: TDynamicBookContentFilters;
};
