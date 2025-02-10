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
    pnpm install --frozen-lockfile

# -------------------- Runner Stage --------------------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY ./README.md /app/README.md
COPY ./src /app/src
COPY ./tsconfig.json /app/tsconfig.json

COPY --from=deps /app /app

# 暴露端口
EXPOSE 8888
# 启动应用
ENTRYPOINT ["npm", "run", "start"]