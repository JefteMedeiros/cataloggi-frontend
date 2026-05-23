import { HugeiconsIcon } from "@hugeicons/react";
import { Book04Icon } from "@hugeicons/core-free-icons";
import { HomeGrid } from "@/components/home/HomeGrid";

export default function Home() {
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
            Catálogo de materiais para projetos de iluminação pública
          </p>
        </header>

        <HomeGrid />
      </div>
    </div>
  );
}
