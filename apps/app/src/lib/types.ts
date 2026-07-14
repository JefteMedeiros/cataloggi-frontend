export type UUID = string;

export type Category = {
  id: UUID;
  name: string;
  slug: string;
  updatedAt: string;
};

export type ItemSummary = {
  id: UUID;
  categoryId: UUID;
  name: string | null;
  firstLetter: string | null;
  updatedAt: string;
};

export type ItemDetail = {
  id: UUID;
  categoryId: UUID;
  name: string | null;
  firstLetter: string | null;
  content: string | null;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};
