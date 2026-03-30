# ==================== Base ====================
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

# ==================== Dependencies ====================
FROM base AS deps

RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod=false

# ==================== Backend Build ====================
FROM base AS backend-builder

COPY --from=deps /app /app
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./tsconfig.base.json
COPY eslint.config.js ./eslint.config.js

RUN pnpm --filter @vodhub/backend build

# ==================== Frontend Build ====================
FROM base AS frontend-builder

COPY --from=deps /app /app

ENV API_BASE_URL=http://backend:8888

COPY . .

RUN pnpm --filter frontend build

# ==================== Backend Runtime ====================
FROM node:24-alpine AS backend

WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=deps /app/apps/backend/package.json apps/backend/package.json

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=backend-builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 8888
CMD ["node", "apps/backend/dist/index.js"]

# ==================== Frontend Runtime ====================
FROM node:24-alpine AS frontend

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=frontend-builder /app/apps/frontend/.next/standalone/apps ./apps
COPY --from=frontend-builder /app/apps/frontend/.next/standalone/node_modules ./node_modules
COPY --from=frontend-builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=frontend-builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]
