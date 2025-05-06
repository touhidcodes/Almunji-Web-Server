//  filter fields
type TAyahFilters = {
  searchTerm?: string;
  number?: string;
  isDeleted?: string;
};

//  pagination fields
type TAyahPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicAyahFilters = Record<string, string>;

// Common combined query options type
export type TAyahQueryFilter = {
  filters: TAyahFilters;
  pagination: TAyahPagination;
  additional: TDynamicAyahFilters;
};
