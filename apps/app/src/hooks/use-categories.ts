import { useCallback, useEffect, useRef, useState } from "react";
import { syncCategories } from "@/lib/categories-sync";
import { getAllCategories, type Category } from "@/lib/db";

interface UseCategoriesResult {
  data: Category[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

function isOnline(): boolean {
  return typeof navigator === "undefined" || navigator.onLine;
}

export function useCategories(): UseCategoriesResult {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const syncPromiseRef = useRef<Promise<void> | null>(null);

  const loadCachedCategories = useCallback(async () => {
    const categories = await getAllCategories();
    setData(categories);
    return categories;
  }, []);

  const runSync = useCallback(async () => {
    if (!isOnline()) {
      setIsError(false);
      return;
    }

    syncPromiseRef.current ??= syncCategories().finally(() => {
      syncPromiseRef.current = null;
    });

    await syncPromiseRef.current;
  }, []);

  const refetch = useCallback(async () => {
    const cachedCategories = await loadCachedCategories();

    if (!isOnline()) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    setIsLoading(cachedCategories.length === 0);

    try {
      await runSync();
      await loadCachedCategories();
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [loadCachedCategories, runSync]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        await refetch();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    function handleOnline() {
      void refetch();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
    };
  }, [refetch]);

  return { data, isLoading, isError, refetch };
}
