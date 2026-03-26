# -------------------- Base Image --------------------
FROM node:22-bookworm AS base

# -------------------- Dependencies Stage --------------------
FROM base AS deps

WORKDIR /app

RUN npm install -g corepack

# 启用 pnpm
RUN corepack enable pnpm

RUN \
    set -ex && \
    echo 'use npm mirror' && \
    npm config set registry https://registry.npmmirror.com && \
    yarn config set registry https://registry.npmmirror.com && \
    pnpm config set registry https://registry.npmmirror.com


COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

RUN \
    set -ex && \
    pnpm install --frozen-lockfile && \
    pnpm rebuild

# -------------------- Build Stage --------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY . /app
COPY --from=deps /app /app

RUN \
    set -ex && \
    npm run build && \
    ls -la /app && \
    du -hd1 /app

# -------------------- Runner Stage --------------------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_SHARP_PATH=node_modules/sharp

# 暴露端口
EXPOSE 3000
# 启动应用
ENTRYPOINT ["node", "server.js"]