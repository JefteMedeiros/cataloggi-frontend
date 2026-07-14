import { useEffect, useState } from "react";
import { getItemsByCategoryId, getItemById } from "@/lib/db";
import type { ItemDetail } from "@/lib/types";
import { useOnlineStatus } from "./use-online-status";

export function useItemsByCategoryId(categoryId: string | undefined) {
  const online = useOnlineStatus();
  const [data, setData] = useState<ItemDetail[]>([]);
  const [cachedLoaded, setCachedLoaded] = useState(!categoryId);

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;

    void getItemsByCategoryId(categoryId).then((items) => {
      if (!cancelled) {
        setData(items);
        setCachedLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const isLoading = !cachedLoaded;

  return { data, isLoading, online };
}

export function useItemById(id: string | undefined) {
  const online = useOnlineStatus();
  const [data, setData] = useState<ItemDetail | null>(null);
  const [cachedLoaded, setCachedLoaded] = useState(!id);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    void getItemById(id).then((item) => {
      if (!cancelled) {
        setData(item ?? null);
        setCachedLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const isLoading = !cachedLoaded;

  return { data, isLoading, online };
}
