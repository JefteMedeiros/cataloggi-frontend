import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type {
  CategoryDto,
  CreateCategoryDto,
  PaginatedResponse,
  UpdateCategoryDto,
  UUID,
} from "../lib/types";

export type CategoriesPageParams = {
  page: number;
  pageSize: number;
  search?: string;
};

export const categoriesQueryKey = (params?: CategoriesPageParams) =>
  params ? (["categories", params] as const) : (["categories"] as const);

export function useCategoriesQuery(params: CategoriesPageParams) {
  return useQuery({
    queryKey: categoriesQueryKey(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
      });
      if (params.search) {
        searchParams.set("search", params.search);
      }
      const res = await apiFetch<PaginatedResponse<CategoryDto>>(
        `/api/categories?${searchParams.toString()}`,
      );
      return res;
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCategoryDto) =>
      apiFetch<CategoryDto>("/api/create-category", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: UUID; body: UpdateCategoryDto }) =>
      apiFetch<CategoryDto>(`/api/update-category/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) =>
      apiFetch<void>(`/api/delete-category/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
