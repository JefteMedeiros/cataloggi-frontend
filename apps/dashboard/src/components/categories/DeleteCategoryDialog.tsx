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
import { useDeleteCategoryMutation } from "../../hooks/use-categories";
import type { CategoryDto } from "../../lib/types";

interface Props {
  category: CategoryDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCategoryDialog({ category, onOpenChange }: Props) {
  const deleteCategory = useDeleteCategoryMutation();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!category) {
      return;
    }

    setLoading(true);

    try {
      await deleteCategory.mutateAsync(category.id);
      toast.success("Categoria excluída");
    } catch {
      toast.error("Falha ao excluir categoria.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={Boolean(category)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir &ldquo;{category?.name}&rdquo;? Esta ação não pode ser desfeita.
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
