import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { getAllCategories, putCategories, putItems } from "@/lib/db";
import type { Category, ItemDetail, PaginatedResponse } from "@/lib/types";
import { useOnlineStatus } from "./use-online-status";

const PAGE_SIZE = 100;

async function fetchAllCategories(): Promise<Category[]> {
  const all: Category[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await apiFetch<PaginatedResponse<Category>>(
      `/api/categories?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.items);
    totalPages = res.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

async function fetchAllItems(): Promise<ItemDetail[]> {
  const all: ItemDetail[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await apiFetch<PaginatedResponse<ItemDetail>>(
      `/api/items?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.items);
    totalPages = res.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export function useCategories() {
  const queryClient = useQueryClient();
  const online = useOnlineStatus();
  const [data, setData] = useState<Category[]>([]);
  const [cachedLoaded, setCachedLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = await getAllCategories();
      if (!cancelled) {
        setData(cached);
        setCachedLoaded(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = useQuery({
    queryKey: ["data-sync"],
    queryFn: async () => {
      const [categories, items] = await Promise.all([
        fetchAllCategories(),
        fetchAllItems(),
      ]);
      await Promise.all([putCategories(categories), putItems(items)]);
      return { categories, items };
    },
    enabled: online,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!query.data) return;

    let cancelled = false;

    void getAllCategories().then((categories) => {
      if (!cancelled) setData(categories);
    });

    return () => {
      cancelled = true;
    };
  }, [query.data]);

  useEffect(() => {
    if (!query.isError) return;

    let cancelled = false;

    void getAllCategories().then((categories) => {
      if (!cancelled) setData(categories);
    });

    return () => {
      cancelled = true;
    };
  }, [query.isError]);

  useEffect(() => {
    if (online) {
      void queryClient.invalidateQueries({ queryKey: ["data-sync"] });
    }
  }, [online, queryClient]);

  const isLoading = !cachedLoaded;

  return {
    data,
    isLoading,
    isError: query.isError,
    online,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["data-sync"] }),
  };
}
