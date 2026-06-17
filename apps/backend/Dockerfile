FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY .npmrc package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @vodhub/backend build

FROM base AS runner
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile --prod --filter @vodhub/backend

ENV NODE_ENV=production
EXPOSE 8888
CMD ["node", "apps/backend/dist/index.js"]
