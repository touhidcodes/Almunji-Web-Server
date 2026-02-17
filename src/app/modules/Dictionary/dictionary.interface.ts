//  filter fields
type TWordFilters = {
  searchTerm?: string;
  word?: string;
  isDeleted?: string;
  persianWord?: string;
};

//  pagination fields
type TWordPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicWordFilters = Record<string, string>;

// Common combined query options type
export type TWordQueryFilter = {
  filters: TWordFilters;
  pagination: TWordPagination;
  additional: TDynamicWordFilters;
};
