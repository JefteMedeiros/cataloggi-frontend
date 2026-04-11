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

This is a React 19 + TypeScript + Vite application. The entry point is `src/main.tsx` → `src/App.tsx`.

**Path alias:** `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### UI Component System

Components live in `src/components/ui/` and follow the shadcn pattern:

- Built on **`@base-ui/react`** primitives for accessibility
- Styled with **Tailwind CSS 4** utility classes
- Variants defined with **`class-variance-authority` (CVA)**
- Classes merged with the `cn()` helper from `src/lib/utils.ts` (combines `clsx` + `tailwind-merge`)

The `components.json` at the root configures the shadcn CLI — new components are added with the Maia style using Base UI and HugeIcons.

### Styling

- `src/index.css` — global Tailwind imports and CSS custom properties (OKLch color space, dark mode via `.dark` class)
- `src/App.css` — app-level component styles
- Font: Figtree Variable (`@fontsource-variable/figtree`)
- Icons: `@hugeicons/react`

### Key Technologies

| Purpose | Package |
|---|---|
| UI framework | React 19 |
| Build | Vite 8 + `@vitejs/plugin-react` (Babel + React Compiler) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Component primitives | `@base-ui/react` |
| Variant management | `class-variance-authority` |
| Icons | `@hugeicons/react` |
| TypeScript | 6.x |
