const queryPickers = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  console.log("query picker", finalObj);
  return finalObj;
};

export default queryPickers;

/**
 * Filters query parameters into three categories: filters, pagination, and additional fields
 */
export function queryFilters(
  query: Record<string, any>,
  knownKeys: string[],
  paginationKeys: string[]
) {
  const filters: Record<string, any> = {};
  const pagination: Record<string, any> = {};
  const additional: Record<string, any> = {};

  // Process each key in the query
  Object.keys(query).forEach((key) => {
    if (paginationKeys.includes(key)) {
      pagination[key] = query[key];
    } else if (knownKeys.includes(key)) {
      filters[key] = query[key];
    } else {
      additional[key] = query[key];
    }
  });

  return { filters, pagination, additional };
}
