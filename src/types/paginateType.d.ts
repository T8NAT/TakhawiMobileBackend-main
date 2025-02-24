export type PaginateType<T> = {
  data: T[];
  pagination: {
    totalPages: number;
    totalItems: number;
    page: number;
    limit: number;
  };
};
