import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ConstructionIcon, BulbIcon, CircuitBoardIcon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, IconSvgElement> = {
  ConstructionIcon,
  BulbIcon,
  CircuitBoardIcon,
};

const cardVariants = cva(
  [
    'group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6',
    'text-card-foreground transition-all duration-200',
    'hover:border-foreground/20 hover:bg-muted/40 hover:shadow-sm hover:-translate-y-0.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'active:translate-y-0',
  ],
);

interface CategoryCardProps {
  href: string;
  icon: keyof typeof ICON_MAP;
  label: string;
  className?: string;
}

export function CategoryCard({ href, icon, label, className }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className={cn(cardVariants(), 'aspect-square no-underline', className)}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
        <HugeiconsIcon icon={ICON_MAP[icon]} size={24} strokeWidth={1.5} />
      </span>
      <span className="text-center text-sm font-medium leading-tight tracking-tight">
        {label}
      </span>
    </Link>
  );
}
