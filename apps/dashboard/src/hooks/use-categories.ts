import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  UUID,
} from "../lib/types";

export const categoriesQueryKey = ["categories"] as const;

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: () => apiFetch<CategoryDto[]>("/api/categories"),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCategoryDto) =>
      apiFetch<CategoryDto>("/api/categories", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: UUID; body: UpdateCategoryDto }) =>
      apiFetch<CategoryDto>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) =>
      apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
}
