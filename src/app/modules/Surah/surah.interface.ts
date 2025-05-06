//  filter fields
type TSurahFilters = {
  searchTerm?: string;
  chapter?: string;
};

//  pagination fields
type TSurahPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicSurahFilters = Record<string, string>;

// Common combined query options type
export type TSurahQueryFilter = {
  filters: TSurahFilters;
  pagination: TSurahPagination;
  additional: TDynamicSurahFilters;
};
