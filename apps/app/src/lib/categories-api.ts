import type { Category } from "@/lib/db";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface PaginatedCategoriesResponse {
  items: Category[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export async function fetchCategoriesUpdatedAfter(
  updatedAfter: string,
  page: number,
  pageSize: number,
): Promise<PaginatedCategoriesResponse> {
  const params = new URLSearchParams({
    updatedAfter,
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(`${BASE_URL}/api/categories?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as PaginatedCategoriesResponse;
}
