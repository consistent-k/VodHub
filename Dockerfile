FROM node:22

WORKDIR /app

COPY ./tsconfig.json /app/
COPY ./pnpm-lock.yaml /app/
COPY ./package.json /app/

# 安装项目的依赖
RUN pnpm install

RUN pwd

# 暴露端口8888
EXPOSE 8888
ENTRYPOINT pnpm start