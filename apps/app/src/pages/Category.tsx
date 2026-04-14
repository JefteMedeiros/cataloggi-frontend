import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CategoryPage } from '@/components/category/CategoryPage';
import { db } from '@/lib/db';
import type { Category, Item } from '@/lib/db';

export default function CategoryRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null | undefined>(undefined);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!slug) return;
    db.categories
      .where('slug')
      .equals(slug)
      .first()
      .then(async (cat) => {
        if (!cat) {
          setCategory(null);
          return;
        }
        setCategory(cat);
        const rows = await db.items
          .where('categoryId')
          .equals(cat.id)
          .sortBy('name');
        setItems(rows);
      });
  }, [slug]);

  // Still loading
  if (category === undefined) {
    return (
      <div className="flex h-svh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  // Not found
  if (category === null) return <Navigate to="/" replace />;

  return <CategoryPage category={category} items={items} />;
}
