export interface PaginationType {
  page: number;
  perPage: number;
  totalPages: number;
}

export type PaginationInputType = Omit<PaginationType, "totalPages">;
