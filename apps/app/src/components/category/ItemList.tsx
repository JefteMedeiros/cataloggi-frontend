import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export function ItemList() {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      <ItemRow letter="A" />
      <ItemRow letter="B" />
      <ItemRow letter="C" />
      <ItemRow letter="D" />
      <ItemRow letter="E" />
      <ItemRow letter="F" />
    </div>
  );
}

function ItemRow({ letter }: { letter: string }) {
  return (
    <Link
      to="/item/placeholder"
      className={cn(
        'group flex h-16 items-center justify-between border-b border-border px-4',
        'text-sm text-foreground no-underline transition-colors duration-100',
        'hover:bg-muted/60',
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium">Item</span>
        <span className="text-xs text-muted-foreground">{letter}</span>
      </div>
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        size={16}
        className="shrink-0 rotate-180 text-muted-foreground opacity-0 transition-opacity duration-100 group-hover:opacity-100"
      />
    </Link>
  );
}
