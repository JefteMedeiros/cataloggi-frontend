import { useSync } from "@/hooks/use-sync";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Button } from "@workspace/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Refresh01Icon, WifiOff01Icon } from "@hugeicons/core-free-icons";

export function Settings() {
  const { isSyncing, lastSync, sync } = useSync();
  const online = useOnlineStatus();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Sincronização</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie a sincronização de dados do aplicativo.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Última sincronização</span>
          <span className="text-sm text-muted-foreground">
            {lastSync
              ? lastSync.toLocaleString("pt-BR")
              : "Nunca sincronizado"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <span className="text-sm text-muted-foreground">
            {!online ? (
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={WifiOff01Icon} size={14} />
                Offline
              </span>
            ) : isSyncing ? (
              "Sincronizando..."
            ) : (
              "Pronto"
            )}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void sync()}
            disabled={!online || isSyncing}
            className="gap-2"
          >
            <HugeiconsIcon
              icon={Refresh01Icon}
              size={14}
              className={isSyncing ? "animate-spin" : ""}
            />
            Sincronizar agora
          </Button>
        </div>
      </div>
    </div>
  );
}
