import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import CategoriesTable from "../components/categories/CategoriesTable";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";
import { apiFetch } from "../lib/api";
import type { CategoryDto } from "../lib/types";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; category: CategoryDto }
  | null;

export default function Categories() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDto | null>(null);

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<CategoryDto[]>("/api/admin/categories"),
  });

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          className="sm:flex-1"
          placeholder="Buscar categorias..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button className="sm:shrink-0" onClick={() => setModal({ mode: "create" })}>
          Nova categoria
        </Button>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>Falha ao carregar categorias.</span>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <CategoriesTable
          categories={filtered}
          isLoading={isLoading}
          onEdit={(category) => setModal({ mode: "edit", category })}
          onDelete={(category) => setDeleteTarget(category)}
        />
      )}

      <CategoryFormModal
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModal(null);
          }
        }}
        category={modal?.mode === "edit" ? modal.category : null}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
