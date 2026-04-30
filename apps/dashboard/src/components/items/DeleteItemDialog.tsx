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
import { useDeleteItemMutation } from "../../hooks/use-items";
import type { ItemSummary } from "../../lib/types";

interface Props {
  item: ItemSummary | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteItemDialog({ item, onOpenChange }: Props) {
  const deleteItem = useDeleteItemMutation();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!item) {
      return;
    }

    setLoading(true);

    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Item excluído");
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
