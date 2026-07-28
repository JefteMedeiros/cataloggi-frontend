FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/app/package.json ./apps/app/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app
RUN pnpm add -g serve
COPY --from=builder /app/apps/dashboard/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
