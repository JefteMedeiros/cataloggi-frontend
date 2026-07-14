import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { ItemDetail } from "@/lib/types";

interface ItemListProps {
  items: ItemDetail[];
  isLoading: boolean;
}

export function ItemList({ items, isLoading }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-16 items-center border-b border-border px-4"
          >
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">
          Nenhum item encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/item/${item.id}`}
          className={cn(
            "group flex h-16 items-center justify-between border-b border-border px-4",
            "text-sm text-foreground no-underline transition-colors duration-100",
            "hover:bg-muted/60",
          )}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-medium">{item.name ?? "Sem nome"}</span>
            <span className="text-xs text-muted-foreground">{item.firstLetter}</span>
          </div>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={16}
            className="shrink-0 rotate-180 text-muted-foreground opacity-0 transition-opacity duration-100 group-hover:opacity-100"
          />
        </Link>
      ))}
    </div>
  );
}
