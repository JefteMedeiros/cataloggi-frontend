import { Input } from "@workspace/ui/components/input";
import { CategoryCard } from "@/components/home/CategoryCard";
import { cn } from "@/lib/utils";

interface HomeGridProps {
  className?: string;
}

export function HomeGrid({ className }: HomeGridProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Input
        disabled
        placeholder="Buscar categorias..."
      />

      <div className="grid grid-cols-2 gap-3">
        <CategoryCard
          href="/category/placeholder"
          icon="ConstructionIcon"
          label="Categoria"
        />
        <CategoryCard
          href="/category/placeholder"
          icon="BulbIcon"
          label="Categoria"
        />
        <CategoryCard
          href="/category/placeholder"
          icon="CircuitBoardIcon"
          label="Categoria"
        />
        <CategoryCard
          href="/category/placeholder"
          icon="ConstructionIcon"
          label="Categoria"
        />
      </div>
    </div>
  );
}
