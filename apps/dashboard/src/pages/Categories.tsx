import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Pagination } from "@workspace/ui/components/pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoriesTable from "../components/categories/CategoriesTable";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";
import { useCategoriesQuery } from "../hooks/use-categories";
import type { CategoryDto } from "../lib/types";

const PAGE_SIZE = 10;

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; category: CategoryDto }
  | null;

export default function Categories() {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDto | null>(null);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useCategoriesQuery({ page, pageSize: PAGE_SIZE, search: debouncedSearch || undefined });

  const categories = response?.items ?? [];
  const totalPages = response?.totalPages ?? 0;

  function goToPage(next: number) {
    setSearchParams((prev) => {
      prev.set("page", String(next));
      return prev;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          className="sm:flex-1"
          placeholder="Buscar categorias..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            goToPage(1);
          }}
        />
        <Button
          className="sm:shrink-0"
          onClick={() => setModal({ mode: "create" })}
        >
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
          categories={categories}
          isLoading={isLoading}
          onEdit={(category) => setModal({ mode: "edit", category })}
          onDelete={(category) => setDeleteTarget(category)}
        />
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

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
