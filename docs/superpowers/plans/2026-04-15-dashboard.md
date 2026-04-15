# Dashboard App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/dashboard` — a JWT-authenticated admin dashboard for managing Items and Categories, wired to real API endpoints with a DEV mock layer.

**Architecture:** New Vite + React app in the monorepo, sharing `@workspace/ui` for all UI components. TanStack Query manages server state; react-hook-form + zod handle forms. Auth token lives in `sessionStorage`; a thin `apiFetch` wrapper attaches it to every request and handles 401 redirects. A `window.fetch` interceptor (DEV only) provides realistic CRUD mock data so the app runs without a live backend.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS 4, React Router v7, TanStack Query v5, react-hook-form v7, zod, sonner, shadcn base-maia components from `@workspace/ui`

**Spec:** `docs/superpowers/specs/2026-04-15-dashboard-design.md`

---

## File Map

### `packages/ui` — new components added by shadcn CLI
- `src/components/form.tsx` — react-hook-form wrappers (Form, FormField, FormItem, FormLabel, FormControl, FormMessage)
- `src/components/input.tsx` — styled `<input>`
- `src/components/textarea.tsx` — styled `<textarea>`
- `src/components/label.tsx` — styled `<label>`
- `src/components/select.tsx` — Base UI Select wrapper
- `src/components/dialog.tsx` — Base UI Dialog wrapper
- `src/components/alert-dialog.tsx` — Base UI AlertDialog wrapper
- `src/components/table.tsx` — styled HTML table elements
- `src/components/sidebar.tsx` — Sidebar component + sub-components
- `src/components/skeleton.tsx` — animated placeholder div
- `src/components/sonner.tsx` — Toaster wrapper around the `sonner` package
- `src/components/separator.tsx` — styled `<hr>`

### `apps/dashboard` — all new
- `index.html` — HTML entry point
- `package.json` — workspace package `@workspace/dashboard`
- `vite.config.ts` — Vite config with Tailwind and path alias
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — TypeScript project references
- `components.json` — shadcn CLI config pointing to `@workspace/ui`
- `eslint.config.js` — ESLint flat config (mirrors apps/app)
- `src/index.css` — imports `@workspace/ui/styles.css`
- `src/main.tsx` — QueryClientProvider + RouterProvider + Toaster; conditionally imports mock
- `src/App.tsx` — renders `<AppRouter />`
- `src/router.tsx` — route tree: /login, /items, /categories, / redirect
- `src/lib/types.ts` — shared TypeScript types (ItemSummary, ItemDetail, CategoryDto, DTOs)
- `src/lib/auth.ts` — getToken / setToken / clearToken (sessionStorage)
- `src/lib/api.ts` — apiFetch: auth headers + 401 redirect + error handling
- `src/lib/slug.ts` — slugify(name: string): string
- `src/mocks/api.ts` — DEV fetch interceptor with in-memory CRUD state
- `src/components/ProtectedRoute.tsx` — checks token, redirects if absent
- `src/components/layout/AppSidebar.tsx` — sidebar nav (Items, Categories)
- `src/components/layout/AppLayout.tsx` — SidebarProvider + header + Outlet
- `src/pages/Login.tsx` — full-page login form
- `src/pages/Items.tsx` — items page (owns search + modal state)
- `src/pages/Categories.tsx` — categories page (owns search + modal state)
- `src/components/items/ItemsTable.tsx` — table with Name/Category/Last Updated/Actions
- `src/components/items/ItemFormModal.tsx` — create/edit dialog with .md upload
- `src/components/items/DeleteItemDialog.tsx` — AlertDialog for item deletion
- `src/components/categories/CategoriesTable.tsx` — table with Name/Slug/Icon/Actions
- `src/components/categories/CategoryFormModal.tsx` — create/edit dialog with slug auto-gen
- `src/components/categories/DeleteCategoryDialog.tsx` — AlertDialog for category deletion

---

## Task 1: Install shadcn components in `packages/ui`

**Files:**
- Modify: `packages/ui/package.json` (shadcn CLI adds deps automatically)
- Create: `packages/ui/src/components/form.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`, `dialog.tsx`, `alert-dialog.tsx`, `table.tsx`, `sidebar.tsx`, `skeleton.tsx`, `sonner.tsx`, `separator.tsx`

- [ ] **Step 1: Run the shadcn CLI from the `packages/ui` directory**

```bash
cd C:\projects\cataloggi\cataloggi-frontend\packages\ui
pnpm exec shadcn add form input textarea label select dialog alert-dialog table sidebar skeleton sonner separator --yes
```

Expected: shadcn generates component files in `src/components/` and updates `package.json` with any new deps (react-hook-form, @hookform/resolvers, sonner, etc.).

- [ ] **Step 2: Verify generated files exist**

```bash
ls C:\projects\cataloggi\cataloggi-frontend\packages\ui\src\components\
```

Expected: `button.tsx`, `dropdown-menu.tsx`, `form.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`, `dialog.tsx`, `alert-dialog.tsx`, `table.tsx`, `sidebar.tsx`, `skeleton.tsx`, `sonner.tsx`, `separator.tsx` (and possibly `use-sidebar.ts` or similar hooks).

- [ ] **Step 3: Check if shadcn generated any hooks files**

```bash
ls C:\projects\cataloggi\cataloggi-frontend\packages\ui\src\
```

If a `hooks/` directory was created (likely for `use-sidebar.ts`), add it to `packages/ui/package.json` exports:

Open `packages/ui/package.json` and add to the `"exports"` block:
```json
"./hooks/*": "./src/hooks/*.ts"
```

The full exports block should look like:
```json
"exports": {
  "./components/*": "./src/components/*.tsx",
  "./lib/*": "./src/lib/*.ts",
  "./hooks/*": "./src/hooks/*.ts",
  "./styles.css": "./src/styles/globals.css"
}
```

(Only add `"./hooks/*"` if the `src/hooks/` directory actually exists after the CLI run.)

- [ ] **Step 4: Run type check on the UI package**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
pnpm run check-types --filter=@workspace/ui
```

Expected: no errors. If there are missing peer deps, install them:
```bash
cd packages/ui && pnpm add react-hook-form @hookform/resolvers sonner
```

- [ ] **Step 5: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add packages/ui/
git commit -m "feat(ui): add form, input, select, dialog, table, sidebar, skeleton, sonner components"
```

---

## Task 2: Scaffold `apps/dashboard`

**Files:**
- Create: `apps/dashboard/index.html`
- Create: `apps/dashboard/package.json`
- Create: `apps/dashboard/vite.config.ts`
- Create: `apps/dashboard/tsconfig.json`
- Create: `apps/dashboard/tsconfig.app.json`
- Create: `apps/dashboard/tsconfig.node.json`
- Create: `apps/dashboard/components.json`
- Create: `apps/dashboard/eslint.config.js`

- [ ] **Step 1: Create `apps/dashboard/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cataloggi Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `apps/dashboard/package.json`**

```json
{
  "name": "@workspace/dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "check-types": "tsc -b",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@tanstack/react-query": "^5.80.0",
    "@workspace/ui": "workspace:*",
    "react-hook-form": "^7.56.0",
    "react-router-dom": "7.14.0",
    "sonner": "^2.0.3",
    "zod": "^3.25.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 3: Create `apps/dashboard/vite.config.ts`**

```typescript
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

- [ ] **Step 4: Create `apps/dashboard/tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 5: Create `apps/dashboard/tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Create `apps/dashboard/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Create `apps/dashboard/components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-maia",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "hugeicons",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

- [ ] **Step 8: Create `apps/dashboard/eslint.config.js`**

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

- [ ] **Step 9: Install dependencies**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
pnpm install
```

Expected: pnpm picks up the new `@workspace/dashboard` package and installs its deps.

- [ ] **Step 10: Commit**

```bash
git add apps/dashboard/
git commit -m "feat(dashboard): scaffold app config and dependencies"
```

---

## Task 3: Shared types + auth/API utilities

**Files:**
- Create: `apps/dashboard/src/lib/types.ts`
- Create: `apps/dashboard/src/lib/auth.ts`
- Create: `apps/dashboard/src/lib/api.ts`
- Create: `apps/dashboard/src/lib/slug.ts`

- [ ] **Step 1: Create `apps/dashboard/src/lib/types.ts`**

```typescript
export type ItemSummary = {
  id: number;
  categoryId: number;
  name: string;
  firstLetter: string;
  updatedAt: string;
};

export type ItemDetail = {
  id: number;
  categoryId: number;
  name: string;
  firstLetter: string;
  content: string;
  updatedAt: string;
};

export type CreateItemDto = {
  categoryId: number;
  name: string;
  content: string;
};

export type UpdateItemDto = {
  name: string;
  content: string;
  categoryId: number;
};

export type CategoryDto = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type CreateCategoryDto = {
  name: string;
  slug: string;
  icon: string;
};
```

- [ ] **Step 2: Create `apps/dashboard/src/lib/auth.ts`**

```typescript
const TOKEN_KEY = "cataloggi_dashboard_token";

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}
```

- [ ] **Step 3: Create `apps/dashboard/src/lib/api.ts`**

```typescript
import { clearToken, getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

type FetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function apiFetch<T>(path: string, init: FetchInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...init.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.replace("/login");
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

- [ ] **Step 4: Create `apps/dashboard/src/lib/slug.ts`**

```typescript
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 5: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/lib/
git commit -m "feat(dashboard): add shared types, auth helpers, api fetch wrapper, and slug utility"
```

---

## Task 4: Dev mock layer

**Files:**
- Create: `apps/dashboard/src/mocks/api.ts`

- [ ] **Step 1: Create `apps/dashboard/src/mocks/api.ts`**

```typescript
import type {
  CategoryDto,
  CreateCategoryDto,
  CreateItemDto,
  ItemDetail,
  ItemSummary,
  UpdateItemDto,
} from "../lib/types";

// ── In-memory state ───────────────────────────────────────────────────────────

let mockCategories: CategoryDto[] = [
  { id: 1, name: "Science", slug: "science", icon: "BookOpenIcon" },
  { id: 2, name: "History", slug: "history", icon: "ArchiveIcon" },
];

const now = new Date().toISOString();

let mockItems: ItemDetail[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Photosynthesis",
    firstLetter: "P",
    content: "# Photosynthesis\n\nThe process by which plants convert sunlight into energy.",
    updatedAt: now,
  },
  {
    id: 2,
    categoryId: 2,
    name: "Roman Empire",
    firstLetter: "R",
    content: "# Roman Empire\n\nOne of the largest empires in ancient history.",
    updatedAt: now,
  },
];

let nextCategoryId = 3;
let nextItemId = 3;

function toSummary(item: ItemDetail): ItemSummary {
  const { content: _content, ...summary } = item;
  return summary;
}

// ── Fetch interceptor ─────────────────────────────────────────────────────────

const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlString =
    input instanceof Request ? input.url : String(input);
  const url = new URL(urlString, window.location.origin);
  const path = url.pathname;
  const method = (init?.method ?? "GET").toUpperCase();

  if (!path.startsWith("/api/admin/")) {
    return originalFetch(input, init);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = init?.body ? JSON.parse(init.body as string) : null;

  // Login
  if (method === "POST" && path === "/api/admin/login") {
    return Promise.resolve(json({ token: "dev-token" }));
  }

  // ── Categories ──────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/admin/categories") {
    return Promise.resolve(json(mockCategories));
  }

  if (method === "POST" && path === "/api/admin/categories") {
    const dto = body as CreateCategoryDto;
    const created: CategoryDto = { id: nextCategoryId++, ...dto };
    mockCategories = [...mockCategories, created];
    return Promise.resolve(json(created, 201));
  }

  const catMatch = path.match(/^\/api\/admin\/categories\/(\d+)$/);
  if (catMatch) {
    const id = parseInt(catMatch[1]);

    if (method === "PUT") {
      const dto = body as CreateCategoryDto;
      mockCategories = mockCategories.map((c) =>
        c.id === id ? { ...c, ...dto } : c
      );
      const updated = mockCategories.find((c) => c.id === id);
      return Promise.resolve(json(updated));
    }

    if (method === "DELETE") {
      mockCategories = mockCategories.filter((c) => c.id !== id);
      return Promise.resolve(new Response(null, { status: 204 }));
    }
  }

  // ── Items ───────────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/admin/items") {
    return Promise.resolve(json(mockItems.map(toSummary)));
  }

  if (method === "POST" && path === "/api/admin/items") {
    const dto = body as CreateItemDto;
    const created: ItemDetail = {
      id: nextItemId++,
      ...dto,
      firstLetter: dto.name.charAt(0).toUpperCase(),
      updatedAt: new Date().toISOString(),
    };
    mockItems = [...mockItems, created];
    return Promise.resolve(json(created, 201));
  }

  const itemMatch = path.match(/^\/api\/admin\/items\/(\d+)$/);
  if (itemMatch) {
    const id = parseInt(itemMatch[1]);

    if (method === "GET") {
      const item = mockItems.find((i) => i.id === id);
      if (!item) return Promise.resolve(new Response(null, { status: 404 }));
      return Promise.resolve(json(item));
    }

    if (method === "PUT") {
      const dto = body as UpdateItemDto;
      mockItems = mockItems.map((i) =>
        i.id === id
          ? {
              ...i,
              ...dto,
              firstLetter: dto.name.charAt(0).toUpperCase(),
              updatedAt: new Date().toISOString(),
            }
          : i
      );
      const updated = mockItems.find((i) => i.id === id);
      return Promise.resolve(json(updated));
    }

    if (method === "DELETE") {
      mockItems = mockItems.filter((i) => i.id !== id);
      return Promise.resolve(new Response(null, { status: 204 }));
    }
  }

  return Promise.resolve(
    new Response(JSON.stringify({ message: "Not found" }), { status: 404 })
  );
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
```

- [ ] **Step 2: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/mocks/
git commit -m "feat(dashboard): add dev mock fetch interceptor with in-memory CRUD"
```

---

## Task 5: App entry point + routing + ProtectedRoute

**Files:**
- Create: `apps/dashboard/src/index.css`
- Create: `apps/dashboard/src/main.tsx`
- Create: `apps/dashboard/src/App.tsx`
- Create: `apps/dashboard/src/components/ProtectedRoute.tsx`
- Create: `apps/dashboard/src/router.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/index.css`**

```css
@import "@workspace/ui/styles.css";
```

- [ ] **Step 2: Create `apps/dashboard/src/main.tsx`**

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  await import("./mocks/api");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
```

- [ ] **Step 3: Create `apps/dashboard/src/App.tsx`**

```typescript
import { AppRouter } from "./router";

export default function App() {
  return <AppRouter />;
}
```

- [ ] **Step 4: Create `apps/dashboard/src/components/ProtectedRoute.tsx`**

```typescript
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function ProtectedRoute() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
```

- [ ] **Step 5: Create `apps/dashboard/src/router.tsx`**

```typescript
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { getToken } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Items from "./pages/Items";
import Categories from "./pages/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={getToken() ? "/items" : "/login"} replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/items", element: <Items /> },
          { path: "/categories", element: <Categories /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

Note: `AppLayout`, `Login`, `Items`, and `Categories` will be created in later tasks. TypeScript will report errors until those files exist — that is expected at this stage.

- [ ] **Step 6: Verify the dev server starts (even with type errors is OK at this stage)**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
pnpm dashboard
```

Expected: Vite starts, browser opens or can be opened at `http://localhost:5173` (or whatever port Vite picks). The page may be blank or show an error because the page components don't exist yet.

- [ ] **Step 7: Commit**

```bash
git add apps/dashboard/src/
git commit -m "feat(dashboard): bootstrap app entry point, router, and protected route"
```

---

## Task 6: Layout components

**Files:**
- Create: `apps/dashboard/src/components/layout/AppSidebar.tsx`
- Create: `apps/dashboard/src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/layout/AppSidebar.tsx`**

Check the exports of the generated sidebar component first:
```bash
head -30 C:\projects\cataloggi\cataloggi-frontend\packages\ui\src\components\sidebar.tsx
```
Use whatever named exports the file provides. The standard shadcn sidebar exports are: `Sidebar`, `SidebarContent`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`. Adjust imports below if names differ.

```typescript
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

const NAV_ITEMS = [
  { label: "Items", href: "/items" },
  { label: "Categories", href: "/categories" },
];

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <span className="text-sm font-semibold">Cataloggi Admin</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link to={item.href}>{item.label}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
```

- [ ] **Step 2: Create `apps/dashboard/src/components/layout/AppLayout.tsx`**

Check sidebar exports for `SidebarProvider` and `SidebarTrigger` — they are typically exported from `sidebar.tsx` as well.

```typescript
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { clearToken } from "../../lib/auth";
import AppSidebar from "./AppSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/items": "Items",
  "/categories": "Categories",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold">
                {PAGE_TITLES[pathname] ?? ""}
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/components/layout/
git commit -m "feat(dashboard): add AppSidebar and AppLayout components"
```

---

## Task 7: Login page

**Files:**
- Create: `apps/dashboard/src/pages/Login.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/pages/Login.tsx`**

```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { apiFetch } from "../lib/api";
import { setToken } from "../lib/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const data = await apiFetch<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setToken(data.token);
      navigate("/items");
    } catch {
      setServerError("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cataloggi Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login works in dev**

Start the dev server:
```bash
cd C:\projects\cataloggi\cataloggi-frontend
pnpm dashboard
```

Open `http://localhost:5173`. You should be redirected to `/login`. Submit with any email + password — the mock accepts everything and returns `{ token: "dev-token" }`. After submit you should be redirected to `/items` (which may be blank if Items page isn't created yet).

- [ ] **Step 3: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/pages/Login.tsx
git commit -m "feat(dashboard): add login page with form validation"
```

---

## Task 8: Categories feature

**Files:**
- Create: `apps/dashboard/src/components/categories/CategoriesTable.tsx`
- Create: `apps/dashboard/src/components/categories/CategoryFormModal.tsx`
- Create: `apps/dashboard/src/components/categories/DeleteCategoryDialog.tsx`
- Create: `apps/dashboard/src/pages/Categories.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/categories/CategoriesTable.tsx`**

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import type { CategoryDto } from "../../lib/types";

interface Props {
  categories: CategoryDto[];
  isLoading: boolean;
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
}

export default function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No categories yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-xs">
              {category.slug}
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              {category.icon}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 2: Create `apps/dashboard/src/components/categories/CategoryFormModal.tsx`**

```typescript
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { apiFetch } from "../../lib/api";
import { slugify } from "../../lib/slug";
import type { CategoryDto, CreateCategoryDto } from "../../lib/types";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryDto | null;
}

export default function CategoryFormModal({ open, onOpenChange, category }: Props) {
  const queryClient = useQueryClient();
  const slugTouched = useRef(false);

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", icon: "" },
  });

  useEffect(() => {
    if (open) {
      slugTouched.current = false;
      form.reset(
        category
          ? { name: category.name, slug: category.slug, icon: category.icon }
          : { name: "", slug: "", icon: "" }
      );
    }
  }, [open, category, form]);

  function handleNameChange(value: string) {
    form.setValue("name", value);
    if (!slugTouched.current) {
      form.setValue("slug", slugify(value));
    }
  }

  async function onSubmit(values: CategoryValues) {
    const body: CreateCategoryDto = values;
    try {
      if (category) {
        await apiFetch(`/api/admin/categories/${category.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("Category updated");
      } else {
        await apiFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Category created");
      }
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        slugTouched.current = true;
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BookOpenIcon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create `apps/dashboard/src/components/categories/DeleteCategoryDialog.tsx`**

```typescript
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { apiFetch } from "../../lib/api";
import type { CategoryDto } from "../../lib/types";

interface Props {
  category: CategoryDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCategoryDialog({ category, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!category) return;
    setLoading(true);
    try {
      await apiFetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      toast.success("Category deleted");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={!!category} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{category?.name}&rdquo;?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 4: Create `apps/dashboard/src/pages/Categories.tsx`**

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { apiFetch } from "../lib/api";
import type { CategoryDto } from "../lib/types";
import CategoriesTable from "../components/categories/CategoriesTable";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; category: CategoryDto }
  | null;

export default function Categories() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDto | null>(null);

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<CategoryDto[]>("/api/admin/categories"),
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setModal({ mode: "create" })}>
          New Category
        </Button>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>Failed to load categories.</span>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <CategoriesTable
          categories={filtered}
          isLoading={isLoading}
          onEdit={(category) => setModal({ mode: "edit", category })}
          onDelete={(category) => setDeleteTarget(category)}
        />
      )}

      <CategoryFormModal
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
        category={modal?.mode === "edit" ? modal.category : null}
      />

      <DeleteCategoryDialog
        category={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Verify Categories page works end-to-end**

Start dev server (`pnpm dashboard`), log in, navigate to `/categories`. Verify:
- Table shows 2 mock categories (Science, History)
- Search filters by name
- "New Category" opens a modal; filling the form and saving adds a row
- Slug auto-populates as you type the name; manually editing slug stops the auto-fill
- Edit opens the modal pre-filled
- Delete shows a confirmation dialog and removes the row on confirm
- Success/error toasts appear

- [ ] **Step 6: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/components/categories/ apps/dashboard/src/pages/Categories.tsx
git commit -m "feat(dashboard): add categories table, form modal, and delete dialog"
```

---

## Task 9: Items feature

**Files:**
- Create: `apps/dashboard/src/components/items/ItemsTable.tsx`
- Create: `apps/dashboard/src/components/items/ItemFormModal.tsx`
- Create: `apps/dashboard/src/components/items/DeleteItemDialog.tsx`
- Create: `apps/dashboard/src/pages/Items.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/items/ItemsTable.tsx`**

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Button } from "@workspace/ui/components/button";
import type { CategoryDto, ItemSummary } from "../../lib/types";

interface Props {
  items: ItemSummary[];
  categories: CategoryDto[];
  isLoading: boolean;
  onEdit: (item: ItemSummary) => void;
  onDelete: (item: ItemSummary) => void;
}

export default function ItemsTable({
  items,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No items yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {categoryMap.get(item.categoryId) ?? "—"}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(item.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 2: Create `apps/dashboard/src/components/items/ItemFormModal.tsx`**

```typescript
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { apiFetch } from "../../lib/api";
import type {
  CategoryDto,
  CreateItemDto,
  ItemDetail,
  ItemSummary,
  UpdateItemDto,
} from "../../lib/types";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.coerce
    .number({ invalid_type_error: "Category is required" })
    .min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
});

type ItemValues = z.infer<typeof itemSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ItemSummary | null;
  categories: CategoryDto[];
}

export default function ItemFormModal({
  open,
  onOpenChange,
  item,
  categories,
}: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", categoryId: 0, content: "" },
  });

  // Fetch full item detail (includes content) when editing
  const { data: itemDetail } = useQuery({
    queryKey: ["item", item?.id],
    queryFn: () => apiFetch<ItemDetail>(`/api/admin/items/${item!.id}`),
    enabled: open && !!item,
  });

  useEffect(() => {
    if (!open) return;
    if (item && itemDetail) {
      form.reset({
        name: itemDetail.name,
        categoryId: itemDetail.categoryId,
        content: itemDetail.content,
      });
    } else if (!item) {
      form.reset({ name: "", categoryId: 0, content: "" });
    }
  }, [open, item, itemDetail, form]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      form.setValue("content", (event.target?.result as string) ?? "", {
        shouldValidate: true,
      });
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-uploaded if needed
    e.target.value = "";
  }

  async function onSubmit(values: ItemValues) {
    try {
      if (item) {
        const body: UpdateItemDto = {
          name: values.name,
          content: values.content,
          categoryId: values.categoryId,
        };
        await apiFetch(`/api/admin/items/${item.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("Item updated");
      } else {
        const body: CreateItemDto = values;
        await apiFetch("/api/admin/items", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Item created");
      }
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "New Item"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <div className="mb-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload .md file
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Markdown content…"
                      className="font-mono text-sm resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create `apps/dashboard/src/components/items/DeleteItemDialog.tsx`**

```typescript
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { apiFetch } from "../../lib/api";
import type { ItemSummary } from "../../lib/types";

interface Props {
  item: ItemSummary | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteItemDialog({ item, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!item) return;
    setLoading(true);
    try {
      await apiFetch(`/api/admin/items/${item.id}`, { method: "DELETE" });
      toast.success("Item deleted");
      await queryClient.invalidateQueries({ queryKey: ["items"] });
    } catch {
      toast.error("Failed to delete item.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={!!item} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{item?.name}&rdquo;?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 4: Create `apps/dashboard/src/pages/Items.tsx`**

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { apiFetch } from "../lib/api";
import type { CategoryDto, ItemSummary } from "../lib/types";
import ItemsTable from "../components/items/ItemsTable";
import ItemFormModal from "../components/items/ItemFormModal";
import DeleteItemDialog from "../components/items/DeleteItemDialog";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; item: ItemSummary }
  | null;

export default function Items() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<ItemSummary | null>(null);

  const {
    data: items = [],
    isLoading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () => apiFetch<ItemSummary[]>("/api/admin/items"),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<CategoryDto[]>("/api/admin/categories"),
  });

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setModal({ mode: "create" })}>New Item</Button>
      </div>

      {itemsError ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>Failed to load items.</span>
          <Button variant="ghost" size="sm" onClick={() => refetchItems()}>
            Retry
          </Button>
        </div>
      ) : (
        <ItemsTable
          items={filtered}
          categories={categories}
          isLoading={itemsLoading}
          onEdit={(item) => setModal({ mode: "edit", item })}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <ItemFormModal
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
        item={modal?.mode === "edit" ? modal.item : null}
        categories={categories}
      />

      <DeleteItemDialog
        item={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Verify Items page works end-to-end**

With dev server running at `http://localhost:5173`:
- `/items` shows 2 mock items (Photosynthesis, Roman Empire)
- Search filters by name
- "New Item" opens a modal with Name, Category select, and Content textarea
- Uploading a `.md` file populates the textarea; text is editable afterward
- Edit opens the modal pre-filled (fetches detail from mock)
- Delete confirms and removes the row
- Category column shows "Science" / "History" (looked up from categories query)
- Success/error toasts appear on all mutations

- [ ] **Step 6: Commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add apps/dashboard/src/components/items/ apps/dashboard/src/pages/Items.tsx
git commit -m "feat(dashboard): add items table, form modal with .md upload, and delete dialog"
```

---

## Task 10: Final validation

- [ ] **Step 1: Run TypeScript type check across the whole monorepo**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
pnpm run check-types
```

Expected: zero errors. Common issues to fix:
- If the shadcn-generated `Select` uses `@base-ui/react/select` directly instead of the `SelectTrigger`/`SelectContent`/`SelectItem` pattern, look at what the generated `select.tsx` actually exports and adapt `ItemFormModal.tsx` accordingly.
- If `SidebarTrigger` or `SidebarProvider` aren't exported from `sidebar.tsx`, check the generated file and update `AppLayout.tsx` imports.
- If `noUnusedLocals` fires on unused imports, remove them.

- [ ] **Step 2: Run linting**

```bash
pnpm run lint
```

Expected: zero errors. Fix any that appear.

- [ ] **Step 3: Run production build**

```bash
pnpm run build
```

Expected: build succeeds with no errors, dist output in `apps/dashboard/dist/`.

- [ ] **Step 4: Manual smoke test — full happy path**

Start the dev server (`pnpm dashboard`) and walk through:

1. Open `http://localhost:5173` → redirected to `/login`
2. Submit login with any email/password → redirected to `/items`
3. Items table shows 2 rows; sidebar shows "Items" as active
4. Search "photo" → only Photosynthesis visible; clear search → both visible
5. Click "New Item" → modal opens; fill all fields + upload a `.md` file → save → toast "Item created" → new row in table
6. Click Edit on a row → modal opens pre-filled → change name → save → toast "Item updated" → row updated
7. Click Delete on a row → AlertDialog appears → confirm → toast "Item deleted" → row gone
8. Navigate to `/categories` via sidebar → categories table shows Science, History
9. Create, edit, delete a category — all work correctly with toasts
10. Click Logout → redirected to `/login`; navigating to `/items` redirects back to `/login`
11. Log in again → redirected to `/items`

- [ ] **Step 5: Commit any fixes from steps 1–4, then final commit**

```bash
cd C:\projects\cataloggi\cataloggi-frontend
git add -p  # stage only relevant fixes
git commit -m "fix(dashboard): resolve type errors and linting issues"

# Then tag the feature complete:
git commit --allow-empty -m "feat(dashboard): dashboard app complete"
```

(Skip the empty commit if there were no fixes in step 4.)
