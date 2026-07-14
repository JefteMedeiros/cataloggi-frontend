import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

const NOTICE_KEY = "cataloggi:first-sync-notice-shown";

export function FirstSyncNotice() {
  const [open, setOpen] = useState(() => {
    return !localStorage.getItem(NOTICE_KEY);
  });

  function handleDismiss() {
    localStorage.setItem(NOTICE_KEY, "1");
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bem-vindo ao Cataloggi</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              O aplicativo sincroniza os dados automaticamente para manter tudo
              atualizado.
            </p>
            <p>
              A sincronização automática ocorre a cada 6 horas. Você também pode
              sincronizar manualmente a qualquer momento nas configurações.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDismiss}>
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
