import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book04Icon } from "@hugeicons/core-free-icons";
import { HomeGrid } from "@/components/home/HomeGrid";
import { db } from "@/lib/db";
import type { Category } from "@/lib/db";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.categories.toArray().then((rows) => {
      setCategories(rows);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* App header */}
        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <HugeiconsIcon icon={Book04Icon} size={28} strokeWidth={1.5} />
            Cataloggi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Navegue e pesquise seu catálogo
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : (
          <HomeGrid categories={categories} />
        )}
      </div>
    </div>
  );
}
