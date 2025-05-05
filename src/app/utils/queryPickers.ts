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

export function queryFilters<
  T extends Record<string, any>,
  K extends keyof T,
  P extends keyof T
>(
  query: T,
  knownKeys: readonly K[],
  paginationKeys: readonly P[]
): {
  filters: Pick<T, K>;
  pagination: Pick<T, P>;
  additional: Omit<T, K | P>;
} {
  const filters = {} as Pick<T, K>;
  const pagination = {} as Pick<T, P>;
  const additional = {} as Omit<T, K | P>;

  Object.keys(query).forEach((key) => {
    if (paginationKeys.includes(key as any)) {
      (pagination as any)[key] = query[key];
    } else if (knownKeys.includes(key as any)) {
      (filters as any)[key] = query[key];
    } else {
      (additional as any)[key] = query[key];
    }
  });

  return { filters, pagination, additional };
}
