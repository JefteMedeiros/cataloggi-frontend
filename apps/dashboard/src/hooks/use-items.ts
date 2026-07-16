import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type {
  CreateItemDto,
  ItemDetail,
  ItemSummary,
  PaginatedResponse,
  UpdateItemDto,
  UUID,
} from "../lib/types";

export type ItemsPageParams = {
  page: number;
  pageSize: number;
  search?: string;
};

export const itemsQueryKey = (params?: ItemsPageParams) =>
  params ? (["items", params] as const) : (["items"] as const);
export const itemQueryKey = (id: UUID | undefined) => ["item", id] as const;

export function useItemSummariesQuery(params: ItemsPageParams) {
  return useQuery({
    queryKey: itemsQueryKey(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
      });
      if (params.search) {
        searchParams.set("search", params.search);
      }
      const res = await apiFetch<PaginatedResponse<ItemSummary>>(
        `/api/item-summaries?${searchParams.toString()}`,
      );
      return res;
    },
  });
}

export function useItemQuery(id: UUID | undefined, enabled: boolean) {
  return useQuery({
    queryKey: itemQueryKey(id),
    queryFn: () => apiFetch<ItemDetail>(`/api/item/${id}`),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateItemDto) =>
      apiFetch<ItemDetail>("/api/create-item", {
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: UUID; body: UpdateItemDto }) =>
      apiFetch<ItemDetail>(`/api/update-item/${id}`, {
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      void queryClient.invalidateQueries({ queryKey: itemQueryKey(variables.id) });
    },
  });
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => apiFetch<void>(`/api/delete-item/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
