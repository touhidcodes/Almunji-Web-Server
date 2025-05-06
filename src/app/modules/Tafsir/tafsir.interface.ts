//  filter fields
type TTafsirFilters = {
  searchTerm?: string;
  tags?: string;
  isDeleted?: string;
};

//  pagination fields
type TTafsirPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicTafsirFilters = Record<string, string>;

// Common combined query options type
export type TTafsirQueryFilter = {
  filters: TTafsirFilters;
  pagination: TTafsirPagination;
  additional: TDynamicTafsirFilters;
};
