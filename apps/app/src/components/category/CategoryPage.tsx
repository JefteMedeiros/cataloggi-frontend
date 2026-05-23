import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@workspace/ui/components/input";
import { Link } from "react-router-dom";
import { AlphaIndex } from "@/components/category/AlphaIndex";
import { ItemList } from "@/components/category/ItemList";

export function CategoryPage() {
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
            Categoria
          </h1>
          <p className="text-xs text-muted-foreground">
            Itens
          </p>
        </div>
      </header>

      <div className="shrink-0 border-b border-border px-4 py-3">
        <Input
          disabled
          placeholder="Buscar itens..."
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <ItemList />
        <div className="shrink-0 border-l border-border">
          <AlphaIndex />
        </div>
      </div>
    </div>
  );
}
