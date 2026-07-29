FROM node:22-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN corepack enable \
    && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/app/package.json ./apps/app/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

COPY . .

RUN echo "Building with VITE_API_URL=${VITE_API_URL}" \
    && pnpm turbo run build --filter=app

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/apps/app/dist ./dist

EXPOSE 3000

CMD ["serve", "dist", "-s", "-n", "-L", "-p", "3000"]
