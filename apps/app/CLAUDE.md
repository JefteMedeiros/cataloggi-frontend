# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start Vite dev server with HMR
pnpm build      # Type-check (tsc -b) then bundle (vite build)
pnpm lint       # Run ESLint
pnpm preview    # Preview production build locally
```

## Architecture

This is a React 19 + TypeScript + Vite PWA (offline-first). The entry point is `src/main.tsx` → `src/App.tsx`.

**Path alias:** `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Data Layer (Offline-First)

The app stores all data locally in **IndexedDB via Dexie** (`src/lib/db.ts`). Two tables:

- `categories` — indexed by `id`, `slug`
- `items` — indexed by `id`, `categoryId`, `firstLetter`, `name`

Data is fetched from `/api/categories` and `/api/items` (paginated, delta-sync via `updated_after`) and bulk-upserted. Sync logic lives in `src/lib/sync.ts`:
- `initSync()` is called at startup (in `main.tsx`)
- Re-syncs on `window.online`
- Uses `localStorage` to track `cataloggi_lastSyncedAt`

**In development**, `src/mocks/api.ts` monkey-patches `window.fetch` to intercept `/api/*` calls and return mock data. It is imported only when `import.meta.env.DEV` is true. When mock data changes, bump `DEV_MOCK_VERSION` in `src/lib/sync.ts` to force a local DB clear + re-sync on the next page load.

### Routing

Three routes defined in `src/router.tsx` via React Router v7:

| Path | Page | Component |
|---|---|---|
| `/` | Home | `src/pages/Home.tsx` → `HomeGrid` |
| `/category/:slug` | Category | `src/pages/Category.tsx` → `CategoryPage` |
| `/item/:id` | Item | `src/pages/Item.tsx` → `ItemPage` |

Pages read directly from Dexie (no global state). `CategoryPage` uses **`@tanstack/react-virtual`** to virtualize the item list. Item content is stored as Markdown and rendered with `react-markdown`.

### UI Component System

Components live in `src/components/ui/` and follow the shadcn pattern:

- Built on **`@base-ui/react`** primitives for accessibility
- Styled with **Tailwind CSS 4** utility classes
- Variants defined with **`class-variance-authority` (CVA)**
- Classes merged with the `cn()` helper from `src/lib/utils.ts` (combines `clsx` + `tailwind-merge`)

The `components.json` at the root configures the shadcn CLI — new components are added with the Maia style using Base UI and HugeIcons.

### Styling

- `src/index.css` — global Tailwind imports and CSS custom properties (OKLch color space, dark mode via `.dark` class)
- Font: Figtree Variable (`@fontsource-variable/figtree`)
- Icons: `@hugeicons/react` (import icon names from `@hugeicons/core-free-icons`)

### Key Technologies

| Purpose | Package |
|---|---|
| UI framework | React 19 + React Compiler (Babel) |
| Build | Vite 8 + `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Component primitives | `@base-ui/react` |
| Local database | Dexie 4 (IndexedDB) |
| Routing | React Router v7 |
| List virtualization | `@tanstack/react-virtual` |
| Markdown rendering | `react-markdown` |
| Icons | `@hugeicons/react` |
| PWA | `vite-plugin-pwa` |
| TypeScript | 6.x |
