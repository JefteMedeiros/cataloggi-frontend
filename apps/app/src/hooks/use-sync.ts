import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  canAutoSync,
  getLastSyncTime,
  performIncrementalSync,
  type SyncProgress,
} from "@/lib/sync";
import { useOnlineStatus } from "./use-online-status";

const FIRST_SYNC_DONE_KEY = "cataloggi:first-sync-done";

export function useSync() {
  const queryClient = useQueryClient();
  const online = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(getLastSyncTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncingRef = useRef(false);

  const sync = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!online || syncingRef.current) return;

      syncingRef.current = true;
      setIsSyncing(true);
      setProgress({ step: "categories", percentage: 0 });
      try {
        await performIncrementalSync((p) => setProgress(p));
        setLastSync(getLastSyncTime());

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["categories"] }),
          queryClient.invalidateQueries({ queryKey: ["items"] }),
          queryClient.invalidateQueries({ queryKey: ["item"] }),
        ]);

        if (!options?.silent) {
          toast.success("Sincronização concluída");
        }
      } catch {
        if (!options?.silent) {
          toast.error("Falha ao sincronizar dados");
        }
      } finally {
        syncingRef.current = false;
        setIsSyncing(false);
        setProgress(null);
      }
    },
    [online, queryClient],
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
    progress,
    lastSync,
    sync,
  };
}
