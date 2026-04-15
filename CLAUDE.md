# Repository Guidelines

## Project Structure & Module Organization
This repository is a `pnpm` workspace monorepo powered by Turborepo.

- `apps/app`: main Cataloggi Vite + React app.
- `apps/dashboard`: dashboard Vite + React app.
- `packages/ui`: shared shadcn UI package (components, styles, utils).
- `apps/*/src`: application code (pages, components, hooks, lib).
- `apps/*/public`: static assets (icons, favicons).

Use workspace imports for shared UI, for example `@workspace/ui/components/button`.

## Build, Test, and Development Commands
Run all commands from the repo root:

- `pnpm install`: install all workspace dependencies.
- `pnpm run dev`: start both apps with Turbo.
- `pnpm run app`: start only `@workspace/app`.
- `pnpm run dashboard`: start only `@workspace/dashboard`.
- `pnpm run check-types`: TypeScript checks across workspaces.
- `pnpm run build`: production builds for all apps.
- `pnpm run lint`: ESLint across workspaces.

## Coding Style & Naming Conventions
- Language: TypeScript + React function components.
- Indentation: match existing files (2 spaces in TS/TSX/CSS).
- Component names: `PascalCase` (`CategoryPage.tsx`).
- Hooks/utilities: `kebab-case` files with clear names (`use-theme.ts`, `utils.ts`).
- Keep app-local imports under `@/*`; keep shared UI imports under `@workspace/ui/*`.
- Never use conditional className template strings; always compose classes with `cn(...)`.
- In `apps/dashboard`, all user-facing text must be in Brazilian Portuguese (`pt-BR`) including labels, placeholders, buttons, toasts, dialogs, page titles, and mock/demo content.
- Linting: ESLint flat config in each app (`apps/*/eslint.config.js`).

## Testing Guidelines
There is currently no dedicated automated test suite configured in this monorepo. Until one is added:

- Treat `check-types`, `lint`, and `build` as required validation.
- For UI or behavior changes, include manual verification steps in the PR.
- If adding tests, prefer colocated `*.test.ts(x)` near source or under `src/__tests__/`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`, `ci:`, `perf:`, `build:`.
- Never add `Co-Authored-By` trailers or any other AI attribution to commits.
- Keep commits focused by workspace (`apps/app`, `apps/dashboard`, `packages/ui`).
- PRs should include a short summary of what changed and why.
- PRs should include the affected workspaces.
- PRs should include validation commands run (for example `pnpm run check-types && pnpm run build`).
- PRs should include screenshots or video for visible UI changes.
