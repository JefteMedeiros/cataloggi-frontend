# Cataloggi Frontend Monorepo

This repository is a Turborepo monorepo managed with `pnpm` workspaces.

## Workspaces

- `apps/app`: main Cataloggi app (Vite + React)
- `apps/dashboard`: dashboard app (Vite + React)
- `packages/ui`: shared shadcn UI package used by both apps

## Requirements

- Node.js 20+
- pnpm 10+

## Install

```bash
pnpm install
```

## Run

- Run both apps:

```bash
pnpm run dev
```

- Run only app:

```bash
pnpm run app
```

- Run only dashboard:

```bash
pnpm run dashboard
```

## Validate

```bash
pnpm run check-types
pnpm run build
pnpm run lint
```

## Shared shadcn UI

Shared components/styles live in `packages/ui` and are imported as:

```ts
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
```

