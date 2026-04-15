# Dashboard App — Design Spec

**Date:** 2026-04-15
**Status:** Approved

---

## 1. Overview

Create `apps/dashboard` — an admin dashboard for managing Items and Categories in the Cataloggi backend. It is a separate Vite app within the existing monorepo, authenticated via JWT, and built against the same shared UI package (`@workspace/ui`) as the existing `apps/app`.

---

## 2. Architecture & Project Setup

### New app location
`apps/dashboard` — sibling to `apps/app`. The root `package.json` already has a `"dashboard"` script (`turbo run dev --filter=@workspace/dashboard`).

### Tooling (mirrors apps/app)
- Vite 8 + `@vitejs/plugin-react`
- React 19 + TypeScript 6
- Tailwind CSS 4 via `@tailwindcss/vite`
- React Router v7 (`react-router-dom`)
- No PWA, no Dexie, no offline layer

### New dependencies (dashboard only)
| Package | Purpose |
|---|---|
| `@tanstack/react-query` | Server state, loading/error, automatic refetch after mutations |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod resolver bridge for react-hook-form |
| `zod` | Schema validation for all forms |
| `sonner` | Toast notifications (peer dep of shadcn Sonner component) |
| `react-router-dom` | Routing |

### Shared UI package additions
Install the following components into `packages/ui` via the shadcn CLI (base-maia style, `@base-ui/react` primitives) before wiring the dashboard:

`form`, `input`, `textarea`, `label`, `select`, `dialog`, `alert-dialog`, `table`, `sidebar`, `skeleton`, `sonner`, `separator`

The shadcn `form` component depends on `react-hook-form`. Add `react-hook-form`, `@hookform/resolvers`, and `zod` as dependencies of `packages/ui` as well — pnpm workspace hoisting means the dashboard can share the same installation.

### Environment variable
`VITE_API_URL` — base URL prepended to all API calls. Defaults to empty string so `/api/...` paths resolve to the same origin in production.

---

## 3. Data Models

Aligned exactly to the backend DTOs. Never send `firstLetter` from the frontend — it is backend-derived.

```typescript
// Items
type ItemSummary   = { id: number; categoryId: number; name: string; firstLetter: string; updatedAt: string }
type ItemDetail    = { id: number; categoryId: number; name: string; firstLetter: string; content: string; updatedAt: string }
type CreateItemDto = { categoryId: number; name: string; content: string }
type UpdateItemDto = { name: string; content: string; categoryId: number }

// Categories
type CategoryDto       = { id: number; name: string; slug: string; icon: string }
type CreateCategoryDto = { name: string; slug: string; icon: string }
```

UI labels use `Name` (not "Title") on tables and forms to match the backend field name.

### Assumed API endpoints
| Method | Path | Body / Response |
|---|---|---|
| POST | `/api/admin/login` | `{ email, password }` → `{ token: string }` |
| GET | `/api/admin/items` | → `ItemSummary[]` |
| GET | `/api/admin/items/:id` | → `ItemDetail` |
| POST | `/api/admin/items` | `CreateItemDto` → `ItemDetail` |
| PUT | `/api/admin/items/:id` | `UpdateItemDto` → `ItemDetail` |
| DELETE | `/api/admin/items/:id` | → 204 |
| GET | `/api/admin/categories` | → `CategoryDto[]` |
| POST | `/api/admin/categories` | `CreateCategoryDto` → `CategoryDto` |
| PUT | `/api/admin/categories/:id` | `CreateCategoryDto` → `CategoryDto` |
| DELETE | `/api/admin/categories/:id` | → 204 |

---

## 4. Auth & API Layer

### `src/lib/auth.ts`
Three helpers that read/write `sessionStorage`:
- `getToken(): string | null`
- `setToken(token: string): void`
- `clearToken(): void`

Token is stored under the key `"cataloggi_dashboard_token"`.

### `src/lib/api.ts`
Thin `fetch` wrapper:
- Prepends `import.meta.env.VITE_API_URL` to every path
- Reads token via `getToken()`, attaches `Authorization: Bearer <token>`
- On 401 response: calls `clearToken()` then `window.location.replace('/login')`
- Returns parsed JSON or throws an `Error` with the response status text

### Auth flow
1. User submits email + password on `/login`
2. POST `/api/admin/login` → on success: `setToken(token)` → navigate to `/items`
3. Logout: `clearToken()` → navigate to `/login`
4. `ProtectedRoute` component checks `getToken()` — if null, renders `<Navigate to="/login" replace />`

### Dev mock layer — `src/mocks/api.ts`
Imported only when `import.meta.env.DEV`. Patches `window.fetch` to intercept `/api/admin/*` calls with in-memory state. Covers:
- `POST /api/admin/login` → `{ token: "dev-token" }`
- Full CRUD for items and categories
- Response shapes match the DTOs exactly

---

## 5. Routing

```
/         → redirect to /items if token present, /login if not
/login    → Login page (no layout wrapper)
/items    → Items page (inside AppLayout, protected)
/categories → Categories page (inside AppLayout, protected)
```

React Router v7 `createBrowserRouter`. Protected routes wrapped in `ProtectedRoute`, which renders `<Outlet>` when authenticated or `<Navigate to="/login" replace />` when not.

---

## 6. Layout

### `AppLayout.tsx`
Wraps all authenticated pages. Contains:
- `SidebarProvider` + `AppSidebar` (left)
- Header bar: current page title (left) + Logout button (right)
- `<main>` with `<Outlet>` for page content

### `AppSidebar.tsx`
Uses the shadcn `Sidebar` component. Two nav links:
- Items → `/items`
- Categories → `/categories`

Active link highlighted using React Router's `useLocation`.

Visual identity: same spacing, radius (`--radius`), color tokens, and Figtree Variable font as `apps/app`. No new design tokens introduced.

---

## 7. File Structure

```
apps/dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── components.json          # base-maia style, aliases → @workspace/ui
├── eslint.config.js
└── src/
    ├── main.tsx             # QueryClientProvider + RouterProvider + Toaster
    ├── App.tsx
    ├── index.css            # @import "@workspace/ui/styles.css"
    ├── router.tsx
    ├── lib/
    │   ├── api.ts
    │   ├── auth.ts
    │   └── slug.ts          # slugify(name: string): string
    ├── mocks/
    │   └── api.ts
    ├── components/
    │   ├── ProtectedRoute.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx
    │   │   └── AppSidebar.tsx
    │   ├── items/
    │   │   ├── ItemsTable.tsx
    │   │   ├── ItemFormModal.tsx
    │   │   └── DeleteItemDialog.tsx
    │   └── categories/
    │       ├── CategoriesTable.tsx
    │       ├── CategoryFormModal.tsx
    │       └── DeleteCategoryDialog.tsx
    └── pages/
        ├── Login.tsx
        ├── Items.tsx
        └── Categories.tsx
```

---

## 8. Pages & Components

### Login.tsx
- Full-page centered form, no sidebar
- shadcn `Form` + `Input` (email, password)
- Zod schema: both fields required, email must be valid format
- On submit: POST `/api/admin/login` → `setToken` → navigate to `/items`
- Error state: inline error message below the form on failed login

### Items.tsx
- Owns `searchQuery` state (string)
- Owns `modalState`: `{ mode: 'create' | 'edit' | null, item?: ItemSummary }`
- Owns `deleteTarget`: `ItemSummary | null`
- Renders: search Input + "New Item" Button + `ItemsTable` + `ItemFormModal` + `DeleteItemDialog`
- Passes filtered list (client-side, case-insensitive `name` match) to `ItemsTable`

### Categories.tsx
- Same structure as Items.tsx but for categories
- Owns `searchQuery`, `modalState`, `deleteTarget`
- Renders: search Input + "New Category" Button + `CategoriesTable` + `CategoryFormModal` + `DeleteCategoryDialog`

### ItemsTable.tsx
Columns: Name | Category | Last Updated | Actions
- Category name looked up from the categories query by `categoryId`
- Last Updated: formatted as locale date string
- Actions: Edit button (opens edit modal) + Delete button (opens confirm dialog)
- Loading state: 5 `Skeleton` rows
- Empty state: centered message when list is empty

### CategoriesTable.tsx
Columns: Name | Slug | Icon | Actions
- Icon: displayed as the raw key string
- Same loading/empty treatment as ItemsTable

### ItemFormModal.tsx
Props: `open`, `onOpenChange`, `item?: ItemSummary | null` (null = create mode)

On open in edit mode: `GET /api/admin/items/:id` to load `content` field, then populate form.

Fields:
- `Name`: Input, required
- `Category`: Select populated from categories query, required
- `Content`: Textarea, required
  - "Upload .md file" button above textarea: `<input type="file" accept=".md">`, reads via `FileReader.readAsText()`, sets form field value
  - User can edit content in textarea after upload

On submit:
- Create: `POST /api/admin/items` with `CreateItemDto`
- Edit: `PUT /api/admin/items/:id` with `UpdateItemDto`
- On success: `invalidateQueries(['items'])` → `onOpenChange(false)` → success toast

### CategoryFormModal.tsx
Props: `open`, `onOpenChange`, `category?: CategoryDto | null`

Fields:
- `Name`: Input, required — `onChange` auto-populates Slug via `slugify()` unless user has manually edited the Slug field
- `Slug`: Input, required, editable
- `Icon`: Input, required (user types the `@hugeicons` icon key)

`slugify(name)`: lowercase → replace spaces with `-` → strip characters that are not `[a-z0-9-]` → collapse multiple hyphens → trim leading/trailing hyphens.

On submit: POST or PUT → `invalidateQueries(['categories'])` → close → success toast.

### DeleteItemDialog.tsx / DeleteCategoryDialog.tsx
shadcn `AlertDialog`. Shows resource name in the confirmation message.
On confirm: DELETE request → invalidate relevant query → success toast.

---

## 9. TanStack Query Setup

`QueryClient` created in `main.tsx` with defaults:
- `staleTime: 0` (always refetch on mount — admin dashboard needs fresh data)
- `retry: 1`

Query keys:
- `['items']` — `GET /api/admin/items`
- `['categories']` — `GET /api/admin/categories`
- `['item', id]` — `GET /api/admin/items/:id` (used inside ItemFormModal for edit)

All mutations call `queryClient.invalidateQueries` on `onSuccess`.

---

## 10. Error Handling & Feedback

| Scenario | Behaviour |
|---|---|
| Login fails | Inline error below form |
| Fetch fails (query) | Inline error message in table area with retry button |
| Mutation fails | Error toast via Sonner |
| Mutation succeeds | Success toast via Sonner |
| 401 on any request | `clearToken()` + redirect to `/login` |

`Toaster` (shadcn Sonner) mounted once in `main.tsx`.

---

## 11. Constraints

- TypeScript throughout — no `any`
- All shadcn components imported from `@workspace/ui/components/*`
- `cn()` helper imported from `@workspace/ui/lib/utils`
- No shadcn components installed locally in `apps/dashboard`
- Visual identity matches `apps/app`: Figtree Variable font, same OKLch color tokens, same border radius
