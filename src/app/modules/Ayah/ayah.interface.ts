//  filter fields
type TAyahFilters = {
  number?: string;
  searchTerm?: string;
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
