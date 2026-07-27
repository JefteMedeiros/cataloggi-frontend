import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book04Icon } from "@hugeicons/core-free-icons";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { HomeGrid } from "@/components/home/HomeGrid";
import { useCategories } from "@/hooks/use-categories";
import { Settings } from "./Settings";

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: allCategories = [], isLoading } = useCategories();

  const categories = useMemo(() => {
    if (!debouncedSearch) return allCategories;
    const term = debouncedSearch.toLowerCase();
    return allCategories.filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term),
    );
  }, [allCategories, debouncedSearch]);

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
          <header className="sticky top-0 z-50 flex flex-col gap-4 bg-background py-8">
            <TabsList>
              <TabsTrigger value="inicio">Início</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
                <HugeiconsIcon icon={Book04Icon} size={28} strokeWidth={1.5} />
                Cataloggi
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Catálogo de materiais para projetos de iluminação pública
              </p>
            </div>
            {activeTab === "inicio" && (
              <Input
                placeholder="Buscar categorias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </header>

          <TabsContent value="inicio">
            <HomeGrid
              categories={categories}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="configuracoes">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
