<div align="center">
   <h1>VodHub</h1>
   一个视频源聚合解决方案，包含后端接口服务和前端播放器
</div>

## 📋 项目简介

VodHub 是一个完整的视频聚合解决方案，包含两个核心部分：

- **后端 (VodHub)**: 电影、电视剧、动漫等视频接口聚合服务，转换多个视频源为标准统一输出
- **前端 (VodNext)**: 视频源聚合播放器，提供分类、搜索、详情、播放等功能

## ✨ 功能特性

### 后端服务 (VodHub)
- 📦 开箱即用的接口服务
- ⚙️ 转换多个视频源为标准输出，支持分类、搜索、详情、播放等功能
- 🛡 使用 TypeScript 开发，保持输出接口的一致性
- 📚 提供可直接部署的 Docker 镜像

### 前端应用 (VodNext)
- 📦 支持 VodHub 标准视频源
- ⚙️ 提供视频分类、搜索、详情、播放等页面
- 🐳 支持 PC、手机端页面自适应
- 🌛 支持一键切换至暗黑模式
- ⚙ 支持自定义网站名称

## 📸 界面展示

#### 首页
![首页](/apps/frontend/docs/images/home.png)

#### 搜索
![搜索](/apps/frontend/docs/images/search.png)

#### 播放页
![播放页](/apps/frontend/docs/images/play.png)

#### 暗黑模式
![暗黑模式](/apps/frontend/docs/images/dark.png)

#### 手机适配
![手机适配](/apps/frontend/docs/images/mobile.png)

## 🖥 开发环境

环境配置文档：[Docs](https://consistent-k.github.io/docs/environment/nodejs.html)

- Node.js >= 24
- PNPM >= 10

## ⌨️ 本地启动

```bash
# 克隆项目
$ git clone git@github.com:consistent-k/VodHub.git
$ cd VodHub

# 安装依赖
$ pnpm install

# 启动前后端服务
$ pnpm dev
```

> 启动成功后访问 http://127.0.0.1:3000/setting 进行配置

### 单独启动

```bash
# 仅启动后端
$ pnpm dev:backend

# 仅启动前端
$ pnpm dev:frontend
```

## 🔧 配置说明

### 配置前端 VodHub 接口地址

#### 方式一
本地启动 VodHub 服务，配置为 `/` 即可

#### 方式二
部署后的 VodHub 地址，配置为 `http://abc.com` 即可

### 后端 API 使用示例

> 以下示例中的 `{{vod_site}}` 为视频源的名称，如 `360kan` 等。

```bash
# 获取目前支持视频源名称列表
curl --location --request GET 'http://localhost:8888/api/vodhub/namespace'
```

```bash
# 通过首页获取分类
curl --location --request GET 'http://localhost:8888/api/vodhub/{{vod_site}}/home'
```

```bash
# 按分类获取视频列表
curl --location --request POST 'http://localhost:8888/api/vodhub/{{vod_site}}/category' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "page": 1,
    "filters": {}
}'
```

```bash
# 获取详情
curl --location --request POST 'http://localhost:8888/api/vodhub/{{vod_site}}/detail' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "{{vod_id}}"
}'
```

```bash
# 获取播放地址
curl --location --request POST 'http://localhost:8888/api/vodhub/{{vod_site}}/play' \
--header 'Content-Type: application/json' \
--data-raw '{
   "url": "",
   "parse_urls": []
}'
```

```bash
# 关键词搜索
curl --location --request POST 'http://localhost:8888/api/vodhub/{{vod_site}}/search' \
--header 'Content-Type: application/json' \
--data-raw '{
   "page": 1,
   "keyword": "钢铁侠"
}'
```

## 💾 Docker 部署

### 后端部署

[![Docker Image Version](https://img.shields.io/docker/v/consistentlee/vod_hub?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/consistentlee/vod_hub)

> 请确保已经安装了 Docker 环境并且配置了 DockerHub 的镜像加速器。

```bash
$ docker run -d -p 8888:8888 consistentlee/vod_hub:latest
```

### Docker Compose 部署

```bash
$ docker-compose up -d
```

## 📂 项目结构

```
VodHub/
├── apps/
│   ├── backend/          # 后端服务 (VodHub)
│   │   ├── src/
│   │   │   ├── routes/   # 接口路由
│   │   │   ├── utils/    # 工具函数
│   │   │   └── types/    # 类型定义
│   │   └── package.json
│   └── frontend/         # 前端应用 (VodNext)
│       ├── app/          # Next.js 页面
│       ├── components/   # 组件
│       ├── lib/          # 工具库
│       └── package.json
├── packages/
│   └── shared/           # 共享类型和工具
├── docker-compose.yml
└── package.json
```

## 🛠 开发命令

```bash
# 安装依赖
pnpm install

# 启动所有服务
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 格式化检查
pnpm format:check

# 提交代码
pnpm commit
```

## 🤝 参与共建

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[贡献指南](./CONTRIBUTING.md)

## 🚨 免责声明

1. 本项目是一个开源的视频聚合解决方案，仅供个人合法地学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
2. 本项目仅转换已有视频网站接口为标准统一输出。本项目不直接提供视频源，也不针对任何特定内容提供源，用户应自行判断视频源的合法性并承担相应责任，开发者对用户获取的任何内容不承担任何责任。
3. 用户在使用本项目时，必须完全遵守所在地区的法律法规，严禁将本项目服务用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
4. 用户使用本项目所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本项目即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。