import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import type { Virtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import type { Item } from '@/lib/db';

interface ItemListProps {
  items: Item[];
  parentRef: React.RefObject<HTMLDivElement | null>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

export function ItemList({ items, parentRef, virtualizer }: ItemListProps) {
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto overscroll-contain">
      <div
        style={{ height: virtualizer.getTotalSize() }}
        className="relative w-full"
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualItem.start}px)` }}
              className="absolute top-0 left-0 w-full"
            >
              <Link
                to={`/item/${item.id}`}
                className={cn(
                  'group flex h-16 items-center justify-between border-b border-border px-4',
                  'text-sm text-foreground no-underline transition-colors duration-100',
                  'hover:bg-muted/60',
                )}
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.firstLetter.toUpperCase()}
                  </span>
                </div>
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={16}
                  className="shrink-0 rotate-180 text-muted-foreground opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
