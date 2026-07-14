import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { canAutoSync, getLastSyncTime, performSync } from "@/lib/sync";
import { useOnlineStatus } from "./use-online-status";

const FIRST_SYNC_DONE_KEY = "cataloggi:first-sync-done";

export function useSync() {
  const queryClient = useQueryClient();
  const online = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(getLastSyncTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sync = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!online || isSyncing) return;

      setIsSyncing(true);
      try {
        const syncTime = await performSync();
        setLastSync(syncTime);

        await queryClient.invalidateQueries({ queryKey: ["data-sync"] });

        if (!options?.silent) {
          toast.success("Sincronização concluída");
        }
      } catch {
        if (!options?.silent) {
          toast.error("Falha ao sincronizar dados");
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [online, isSyncing, queryClient],
  );

  useEffect(() => {
    if (!online) return;

    const isFirstTime = !localStorage.getItem(FIRST_SYNC_DONE_KEY);

    if (isFirstTime || canAutoSync()) {
      void sync({ silent: !isFirstTime }).then(() => {
        localStorage.setItem(FIRST_SYNC_DONE_KEY, "1");
      });
    }
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!online) return;

    intervalRef.current = setInterval(() => {
      if (canAutoSync()) {
        void sync({ silent: true });
      }
    }, 60 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isSyncing,
    lastSync,
    sync,
  };
}
