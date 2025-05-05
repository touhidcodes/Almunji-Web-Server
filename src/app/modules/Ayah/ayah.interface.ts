// Known filter fields
type TAyahFilters = {
  number?: string;
  searchTerm?: string;
  isDeleted?: string;
};

// Known pagination fields
type TAyahPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

// Unknown but valid additional filters
type TDynamicAyahFilters = Record<string, string>;

// Common combined query options type
export type TAyahQueryOptions = {
  filters: TAyahFilters;
  pagination: TAyahPagination;
  additional: TDynamicAyahFilters;
};
