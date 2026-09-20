export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: PageableObject;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
