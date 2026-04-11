import { useState, useMemo } from "react";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryCard } from "@/components/home/CategoryCard";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/db";

interface HomeGridProps {
  categories: Category[];
  className?: string;
}

export function HomeGrid({ categories, className }: HomeGridProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      search.trim() === ""
        ? categories
        : categories.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()),
          ),
    [categories, search],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar categorias…"
        size="lg"
      />

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nenhuma categoria encontrada para &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
