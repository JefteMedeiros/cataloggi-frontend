import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchBar } from '@/components/home/SearchBar';
import { AlphaIndex } from '@/components/category/AlphaIndex';
import { ItemList } from '@/components/category/ItemList';
import type { Category, Item } from '@/lib/db';

interface CategoryPageProps {
  category: Category;
  items: Item[];
}

export function CategoryPage({ category, items }: CategoryPageProps) {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (search.trim() === '') return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  const availableLetters = useMemo(
    () => new Set(filteredItems.map((item) => item.firstLetter)),
    [filteredItems],
  );

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 12,
  });

  const handleLetterClick = (letter: string) => {
    const index = filteredItems.findIndex((item) => item.firstLetter === letter);
    if (index !== -1) {
      virtualizer.scrollToIndex(index, { align: 'start' });
      setActiveLetter(letter);
    }
  };

  return (
    <div className="flex h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Link
          to="/"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Voltar para início"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setActiveLetter(null);
          }}
          placeholder={`Buscar em ${category.name}…`}
        />
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1">
        {filteredItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Nenhum resultado para &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <>
            <ItemList
              items={filteredItems}
              parentRef={parentRef}
              virtualizer={virtualizer}
            />
            <div className="shrink-0 border-l border-border">
              <AlphaIndex
                availableLetters={availableLetters}
                activeLetter={activeLetter}
                onLetterClick={handleLetterClick}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
