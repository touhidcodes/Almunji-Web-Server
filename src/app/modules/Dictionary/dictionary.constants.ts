// For filter from all words
export const wordFilterableFields: string[] = [
  "searchTerm",
  "word",
  "isDeleted",
];
// For filter from suggestion words
export const wordSuggestionFilterableFields: string[] = ["searchTerm", "word"];

// For pagination
export const wordPaginationFields: string[] = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
];

// For query
export const wordQueryFields: string[] = ["word", "definition"];
