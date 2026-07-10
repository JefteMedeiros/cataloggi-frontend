export type UUID = string;

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

export type CreateItemDto = {
  categoryId?: UUID | null;
  name: string;
  content: string;
};

export type UpdateItemDto = {
  name: string;
  content: string;
  categoryId?: UUID | null;
};

export type CategoryDto = {
  id: UUID;
  name: string | null;
  slug: string | null;
  updatedAt: string;
};

export type CreateCategoryDto = {
  name: string;
};

export type UpdateCategoryDto = CreateCategoryDto;

export type LoginRequestDto = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  token: string | null;
  expiresAt: string;
};

export type ErrorResponseDto = {
  message?: string | null;
};

export type ValidationProblemDetails = {
  title?: string | null;
  detail?: string | null;
  status?: number | null;
  errors?: Record<string, string[]> | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};
