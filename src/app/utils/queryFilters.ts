// export function queryFilters<
//   T extends Record<string, any>,
//   K extends keyof T & string,
//   P extends keyof T & string
// >(
//   query: T,
//   knownKeys: readonly K[],
//   paginationKeys: readonly P[]
// ): {
//   filters: Pick<T, K>;
//   pagination: Pick<T, P>;
//   additional: Omit<T, K | P>;
// } {
//   const filters = {} as Pick<T, K>;
//   const pagination = {} as Pick<T, P>;
//   const additional = {} as Omit<T, K | P>;

//   for (const key in query) {
//     if (paginationKeys.includes(key as P)) {
//       (pagination as Record<string, any>)[key] = query[key];
//     } else if (knownKeys.includes(key as K)) {
//       (filters as Record<string, any>)[key] = query[key];
//     } else {
//       (additional as Record<string, any>)[key] = query[key];
//     }
//   }

//   return { filters, pagination, additional };
// }
