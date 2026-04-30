import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type {
  CreateItemDto,
  ItemDetail,
  ItemSummary,
  UpdateItemDto,
  UUID,
} from "../lib/types";

export const itemsQueryKey = ["items"] as const;
export const itemQueryKey = (id: UUID | undefined) => ["item", id] as const;

export function useItemSummariesQuery() {
  return useQuery({
    queryKey: itemsQueryKey,
    queryFn: () => apiFetch<ItemSummary[]>("/api/items/summaries"),
  });
}

export function useItemQuery(id: UUID | undefined, enabled: boolean) {
  return useQuery({
    queryKey: itemQueryKey(id),
    queryFn: () => apiFetch<ItemDetail>(`/api/items/${id}`),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateItemDto) =>
      apiFetch<ItemDetail>("/api/items", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsQueryKey });
    },
  });
}

export function useUpdateItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: UUID; body: UpdateItemDto }) =>
      apiFetch<ItemDetail>(`/api/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: itemsQueryKey });
      void queryClient.invalidateQueries({ queryKey: itemQueryKey(variables.id) });
    },
  });
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => apiFetch<void>(`/api/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemsQueryKey });
    },
  });
}
