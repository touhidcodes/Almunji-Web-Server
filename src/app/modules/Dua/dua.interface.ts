//  filter fields
type TDuaFilters = {
  searchTerm?: string;
  tags?: string;
  isDeleted?: string;
};

//  pagination fields
type TDuaPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

//  additional filters
type TDynamicDuaFilters = Record<string, string>;

// Common combined query options type
export type TDuaQueryFilter = {
  filters: TDuaFilters;
  pagination: TDuaPagination;
  additional: TDynamicDuaFilters;
};
