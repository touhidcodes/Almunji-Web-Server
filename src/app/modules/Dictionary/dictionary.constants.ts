// For filter from all words
export const wordFilterableFields: string[] = [
  "searchTerm",
  "persianWord",
  "isDeleted",
];
// For filter from suggestion words
export const wordSuggestionFilterableFields: string[] = [
  "searchTerm",
  "persianWord",
];

// For pagination
export const wordPaginationFields: string[] = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
];

// For query (fields used in full-text search)
export const wordQueryFields: string[] = [
  "persianWord",
  "transliteration",
  "banglaMeaning",
  "englishMeaning",
];
