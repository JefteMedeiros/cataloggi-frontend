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

export type SyncCategoryItem = {
  id: UUID;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type SyncItemSummary = {
  id: UUID;
  categoryId: UUID;
  name: string | null;
  firstLetter: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SyncResponse<T> = {
  updated: T[];
  deleted: string[];
  syncedAt: string;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

export type SyncHistoryEntry = {
  id: UUID;
  startedAt: string;
  completedAt: string | null;
  status: "success" | "failed";
  categoriesUpdated: number;
  categoriesDeleted: number;
  itemsUpdated: number;
  itemsDeleted: number;
};
