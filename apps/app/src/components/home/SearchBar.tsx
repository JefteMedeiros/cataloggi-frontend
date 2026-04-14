import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const searchBarVariants = cva(
  'flex items-center gap-2 rounded-xl border border-border bg-card px-3 transition-all focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-ring/30',
  {
    variants: {
      size: {
        default: 'h-10',
        lg: 'h-12',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar…', size, className }: SearchBarProps) {
  return (
    <div className={cn(searchBarVariants({ size }), className)}>
      <HugeiconsIcon icon={Search01Icon} size={16} className="shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  );
}
