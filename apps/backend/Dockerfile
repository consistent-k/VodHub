FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile --prod=false
COPY apps/backend/ ./apps/backend/
RUN mkdir -p apps/backend/logs && cd apps/backend && pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/logs ./apps/backend/logs
COPY package.json pnpm-workspace.yaml ./

ENV NODE_ENV=production
EXPOSE 8888
CMD ["node", "apps/backend/dist/index.js"]
