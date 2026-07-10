import { Button } from "@workspace/ui/components/button";
import { CategoryCard } from "@/components/home/CategoryCard";
import type { Category } from "@/lib/db";
import { cn } from "@/lib/utils";

interface HomeGridProps {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  className?: string;
}

export function HomeGrid({
  categories,
  isLoading,
  isError,
  onRetry,
  className,
}: HomeGridProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {isError ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span>Falha ao atualizar categorias.</span>
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-2xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              iconIndex={index}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nenhuma categoria disponível.
        </div>
      )}
    </div>
  );
}
