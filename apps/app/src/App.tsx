import { WifiOff01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AppRouter } from "@/router";
import { FirstSyncNotice } from "@/components/first-sync-notice";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { useOnlineStatus } from "@/hooks/use-online-status";

export default function App() {
  const online = useOnlineStatus();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme-app">
      <AppRouter />
      <div className="fixed right-3 top-3 z-50 flex items-center gap-2">
        {!online && (
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={WifiOff01Icon} size={14} strokeWidth={1.5} />
            Modo offline
          </div>
        )}
        <ModeToggle />
      </div>
      <InstallAppButton />
      <FirstSyncNotice />
    </ThemeProvider>
  );
}
