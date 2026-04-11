import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ItemPage } from '@/components/item/ItemPage';
import { db } from '@/lib/db';
import type { Item, Category } from '@/lib/db';

export default function ItemRoute() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null | undefined>(undefined);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setItem(null);
      return;
    }
    db.items.get(numericId).then(async (found) => {
      if (!found) {
        setItem(null);
        return;
      }
      setItem(found);
      const cat = await db.categories.get(found.categoryId);
      setCategory(cat ?? null);
    });
  }, [id]);

  // Still loading
  if (item === undefined) {
    return (
      <div className="flex h-svh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  // Not found
  if (item === null) return <Navigate to="/" replace />;

  return <ItemPage item={item} categorySlug={category?.slug ?? ''} />;
}
