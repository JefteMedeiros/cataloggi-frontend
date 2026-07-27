import { useQuery } from "@tanstack/react-query";
import { getItemsByCategoryId, getItemById } from "@/lib/db";

export const itemsByCategoryQueryKey = (categoryId: string) =>
  ["items", categoryId] as const;

export const itemQueryKey = (id: string) => ["item", id] as const;

export function useItemsByCategoryId(categoryId: string | undefined) {
  return useQuery({
    queryKey: itemsByCategoryQueryKey(categoryId ?? ""),
    queryFn: () => getItemsByCategoryId(categoryId!),
    enabled: Boolean(categoryId),
  });
}

export function useItemById(id: string | undefined) {
  return useQuery({
    queryKey: itemQueryKey(id ?? ""),
    queryFn: () => getItemById(id!),
    enabled: Boolean(id),
  });
}
