import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Book04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/auth";

const PAGE_TITLES: Record<string, string> = {
  "/items": "Itens",
  "/categories": "Categorias",
};

const NAV_ITEMS = [
  { label: "Itens", href: "/items" },
  { label: "Categorias", href: "/categories" },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
              <HugeiconsIcon icon={Book04Icon} size={28} strokeWidth={1.5} />
              Cataloggi Admin
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {PAGE_TITLES[pathname] ?? "Gerencie o conteúdo do catálogo"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        <nav className="mb-4 flex gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-foreground/20 bg-muted text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
