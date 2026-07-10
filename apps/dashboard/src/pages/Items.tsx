import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Pagination } from "@workspace/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@workspace/ui/components/select";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DeleteItemDialog from "../components/items/DeleteItemDialog";
import ItemFormModal from "../components/items/ItemFormModal";
import ItemsTable from "../components/items/ItemsTable";
import { useCategoriesQuery } from "../hooks/use-categories";
import { useItemSummariesQuery } from "../hooks/use-items";
import type { ItemSummary } from "../lib/types";

const PAGE_SIZE = 10;

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; item: ItemSummary }
  | null;

export default function Items() {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<ItemSummary | null>(null);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: response,
    isLoading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useItemSummariesQuery({ page, pageSize: PAGE_SIZE, search: debouncedSearch || undefined });

  const items = response?.items ?? [];
  const totalPages = response?.totalPages ?? 0;

  const { data: categoriesResponse } = useCategoriesQuery({ page: 1, pageSize: 1000 });
  const categories = categoriesResponse?.items ?? [];

  const filtered = items.filter((item) =>
    selectedCategoryId === "all" || item.categoryId === selectedCategoryId,
  );

  const selectedCategoryLabel =
    selectedCategoryId === "all"
      ? "Todas as categorias"
      : (categories.find((category) => category.id === selectedCategoryId)
          ?.name ?? "Todas as categorias");

  function goToPage(next: number) {
    setSearchParams((prev) => {
      prev.set("page", String(next));
      return prev;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            className="sm:flex-1"
            placeholder="Buscar itens..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              goToPage(1);
            }}
          />
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => {
              setSelectedCategoryId(value ?? "all");
              goToPage(1);
            }}
          >
            <SelectTrigger className="sm:w-56">
              <span>{selectedCategoryLabel}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="sm:shrink-0"
          onClick={() => setModal({ mode: "create" })}
        >
          Novo item
        </Button>
      </div>

      {itemsError ? (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>Falha ao carregar itens.</span>
          <Button variant="ghost" size="sm" onClick={() => refetchItems()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <ItemsTable
          items={filtered}
          categories={categories}
          isLoading={itemsLoading}
          onEdit={(item) => setModal({ mode: "edit", item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
      />

      <ItemFormModal
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModal(null);
          }
        }}
        item={modal?.mode === "edit" ? modal.item : null}
        categories={categories}
      />

      <DeleteItemDialog
        item={deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
