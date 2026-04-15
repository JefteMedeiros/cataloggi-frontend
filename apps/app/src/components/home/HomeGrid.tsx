import { Input } from "@workspace/ui/components/input";
import { useMemo, useState } from "react";
import { CategoryCard } from "@/components/home/CategoryCard";
import type { Category } from "@/lib/db";
import { cn } from "@/lib/utils";

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
        : categories.filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase()),
          ),
    [categories, search],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar categorias..."
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
