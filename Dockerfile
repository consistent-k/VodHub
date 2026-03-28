# syntax=docker/dockerfile:1.22

# ==================== Base ====================
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

# ==================== Dependencies ====================
FROM base AS deps

# 安装必要的构建工具（用于原生模块）
RUN apk add --no-cache python3 make g++

# 只复制依赖声明（最大化缓存）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

# 安装所有依赖（包括dev依赖）
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod=false

# ==================== Frontend Build ====================
FROM base AS frontend-builder

# 先拿依赖
COPY --from=deps /app /app

# 设置后端 API 地址（用于构建时替换）
ENV API_BASE_URL=http://backend:8888

# 再复制源码
COPY . .

# 只构建 frontend
RUN pnpm --filter frontend build

# ==================== Backend Runtime ====================
FROM node:24-alpine AS backend

WORKDIR /app

RUN corepack enable

# 从deps阶段复制完整的依赖（包括dev依赖）
COPY --from=deps /app /app
# 复制后端源码和 shared 包
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./tsconfig.base.json

# 重新安装以建立 workspace 链接
RUN pnpm install --frozen-lockfile --prod=false

EXPOSE 8888
CMD ["pnpm", "--filter", "backend", "run", "start"]

# ==================== Frontend Runtime ====================
FROM node:24-alpine AS frontend

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js standalone 输出 (Next.js 16 路径)
COPY --from=frontend-builder /app/apps/frontend/.next/standalone/apps ./apps
COPY --from=frontend-builder /app/apps/frontend/.next/standalone/node_modules ./node_modules
COPY --from=frontend-builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=frontend-builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]