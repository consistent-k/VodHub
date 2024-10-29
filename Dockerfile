# 使用官方的 Node.js 22 版本作为基础镜像
FROM node:22

# 设置容器内的工作目录为 /home/work/vod-hub
WORKDIR /home/work/vod-hub

# 将 package.json 文件拷贝到工作目录
COPY package.json ./

# 全局安装 pnpm 包管理工具
RUN npm install -g pnpm

# 安装项目的依赖
RUN pnpm install

# 将项目的所有文件拷贝到工作目录
COPY . ./

RUN pwd

# 暴露端口8888
EXPOSE 8888
ENTRYPOINT ["pnpm", "start"]