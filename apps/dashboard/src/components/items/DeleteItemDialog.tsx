import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "../../lib/api";
import type { ItemSummary } from "../../lib/types";

interface Props {
  item: ItemSummary | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteItemDialog({ item, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!item) {
      return;
    }

    setLoading(true);

    try {
      await apiFetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
      toast.success("Item excluído");
      await queryClient.invalidateQueries({ queryKey: ["items"] });
    } catch {
      toast.error("Falha ao excluir item.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir item?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir &ldquo;{item?.name}&rdquo;? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
