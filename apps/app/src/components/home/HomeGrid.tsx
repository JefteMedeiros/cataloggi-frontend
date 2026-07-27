import { CategoryCard } from "@/components/home/CategoryCard";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HomeGridProps {
  categories: Category[];
  isLoading: boolean;
  className?: string;
}

export function HomeGrid({
  categories,
  isLoading,
  className,
}: HomeGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={cn("rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground", className)}>
        Nenhuma categoria disponível.
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          iconIndex={index}
        />
      ))}
    </div>
  );
}
