import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/lib/db";

export const categoriesQueryKey = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
  });
}
