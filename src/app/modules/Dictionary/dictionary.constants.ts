// For filter from all words
export const wordFilterableFields: string[] = [
  "searchTerm",
  "word",
  "isDeleted",
  "sortBy",
  "sortOrder",
];
// For filter from suggestion words
export const wordSuggestionFilterableFields: string[] = [
  "searchTerm",
  "word",
  "sortBy",
  "sortOrder",
];

// For pagination
export const wordPaginationFields: string[] = ["limit", "page"];

// For query
export const wordQueryFields: string[] = ["word", "definition"];
