//  filter fields
type TParaFilters = {
  searchTerm?: string;
  number?: string;
};

//  pagination fields
type TParaPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicParaFilters = Record<string, string>;

// Common combined query options type
export type TParaQueryFilter = {
  filters: TParaFilters;
  pagination: TParaPagination;
  additional: TDynamicParaFilters;
};
