import { useEffect, useMemo, useState } from "react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@workspace/ui/components/input";
import { Link, useParams } from "react-router-dom";
import { AlphaIndex } from "@/components/category/AlphaIndex";
import { ItemList } from "@/components/category/ItemList";
import { getCategoryBySlug } from "@/lib/db";
import { useItemsByCategoryId } from "@/hooks/use-items";
import type { Category } from "@/lib/types";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    void getCategoryBySlug(slug).then((cat) => {
      if (!cancelled) setCategory(cat ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const { data: allItems, isLoading } = useItemsByCategoryId(category?.id);

  const items = useMemo(() => {
    if (!debouncedSearch) return allItems;
    const term = debouncedSearch.toLowerCase();
    return allItems.filter(
      (item) =>
        (item.name ?? "").toLowerCase().includes(term) ||
        (item.firstLetter ?? "").toLowerCase().includes(term),
    );
  }, [allItems, debouncedSearch]);

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Link
          to="/"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Voltar para inicio"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {category?.name ?? "Categoria"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {allItems.length} {allItems.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </header>

      <div className="shrink-0 border-b border-border px-4 py-3">
        <Input
          placeholder="Buscar itens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <ItemList items={items} isLoading={isLoading} />
        <div className="shrink-0 border-l border-border">
          <AlphaIndex items={items} />
        </div>
      </div>
    </div>
  );
}
