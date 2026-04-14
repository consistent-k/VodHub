<div align="center">
   <h1>VodHub</h1>
   一个视频源聚合解决方案
</div>

## 📋 项目简介

VodHub 是一个完整的视频聚合解决方案，包含两个核心部分：

- **后端**: 电影、电视剧、动漫等视频接口聚合服务，转换多个视频源为标准统一输出、支持CMS视频源接入
- **前端**: 视频源聚合播放器，提供分类、搜索、详情、播放等功能

## ✨ 功能特性

### 后端服务
- 📦 开箱即用的接口服务
- ⚙️ 转换多个视频源为标准输出，支持分类、搜索、详情、播放等功能
- 🛡 使用 TypeScript 开发，保持输出接口的一致性

### 前端应用
- 📦 支持 VodHub 标准视频源
- ⚙️ 提供视频分类、搜索、详情、播放等页面
- 🐳 支持 PC、手机端页面自适应

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
curl --location --request GET 'http://127.0.0.1:8888/api/vodhub/namespace'
```

```bash
# 通过首页获取分类
curl --location --request GET 'http://127.0.0.1:8888/api/vodhub/{{vod_site}}/home'
```

```bash
# 按分类获取视频列表
curl --location --request POST 'http://127.0.0.1:8888/api/vodhub/{{vod_site}}/category' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "page": 1,
    "filters": {}
}'
```

```bash
# 获取详情
curl --location --request POST 'http://127.0.0.1:8888/api/vodhub/{{vod_site}}/detail' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "{{vod_id}}"
}'
```

```bash
# 获取播放地址
curl --location --request POST 'http://127.0.0.1:8888/api/vodhub/{{vod_site}}/play' \
--header 'Content-Type: application/json' \
--data-raw '{
   "url": "",
   "parse_urls": []
}'
```

```bash
# 关键词搜索
curl --location --request POST 'http://127.0.0.1:8888/api/vodhub/{{vod_site}}/search' \
--header 'Content-Type: application/json' \
--data-raw '{
   "page": 1,
   "keyword": "钢铁侠"
}'
```

## 💾 Docker 部署


### Docker Compose 部署

#### 镜像加速器配置
为提高 Docker 镜像拉取速度，建议配置镜像加速器：

1. **创建/修改 Docker 配置文件**：
   ```bash
   sudo mkdir -p /etc/docker
   sudo tee /etc/docker/daemon.json <<-'EOF'
   {
     "registry-mirrors": [
       "https://docker.mirrors.ustc.edu.cn",
       "https://hub-mirror.c.163.com",
       "https://mirror.baidubce.com"
     ]
   }
   EOF
   ```

2. **重启 Docker 服务**：
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart docker
   ```

3. **验证配置**：
   ```bash
   docker info | grep -A 1 "Registry Mirrors"
   ```

#### 开发环境
使用 `docker-compose.yml` 配置文件：

```bash
$ docker-compose up -d
```

#### 生产环境
使用 `docker-compose.prod.yml` 配置文件，包含 Redis 缓存服务、日志持久化等生产环境优化：

```bash
$ docker-compose -f docker-compose.prod.yml up -d
```

**生产环境配置说明：**
- **服务架构**：包含 frontend、backend、redis 三个服务
- **端口映射**：
  - 前端：127.0.0.1:3000 → 容器 80 端口（如需外部访问可改为 `3000:80`）
  - 后端：127.0.0.1:8888 → 容器 8888 端口
  - Redis：127.0.0.1:6379 → 容器 6379 端口（仅本地访问）
- **环境变量**：
  - `REDIS_URL=redis://redis:6379` - Redis 连接地址
  - `CACHE_TTL=60000` - 缓存时间（毫秒）
  - `BANNED_KEYWORDS=测试` - 禁用关键词
- **数据持久化**：
  - 后端日志：主机 `./logs` 目录映射到容器日志目录
- **依赖关系**：backend 依赖 redis 服务启动

**环境变量自定义：**
可根据实际需求在 `docker-compose.prod.yml` 中修改环境变量值，或通过 `.env` 文件注入。

## 📂 项目结构

VodHub 是一个基于 pnpm workspace 的 monorepo，采用现代化的前后端分离架构：

```
VodHub/
├── apps/
│   ├── backend/                    # 后端服务 (Hono + TypeScript)
│   │   ├── src/
│   │   │   ├── api/                # API 入口和中间件
│   │   │   ├── config/             # 配置文件
│   │   │   ├── constant/           # 常量定义
│   │   │   ├── middleware/         # 中间件（缓存、CORS、压缩等）
│   │   │   ├── routes/             # 视频源路由（按提供商组织）
│   │   │   ├── types/              # 后端专用类型定义
│   │   │   └── utils/              # 工具函数（缓存、日志、CMS 工厂等）
│   │   ├── Dockerfile              # 容器化配置
│   │   └── package.json
│   └── frontend/                   # 前端应用 (Vite + React 19 + React Router)
│       ├── src/
│       │   ├── components/         # 可复用组件（VodList、Player、Setting 等）
│       │   ├── lib/                # 工具库（主题、状态管理、工具函数）
│       │   ├── pages/              # React Router 页面路由
│       │   ├── services/           # API 服务层
│       │   └── App.tsx             # 应用根组件
│       ├── conf/                   # 配置文件（nginx.conf）
│       ├── index.html              # 入口 HTML
│       ├── Dockerfile              # 容器化配置
│       └── package.json
├── packages/
│   └── shared/                     # 共享类型和工具
│       ├── src/types/              # 核心类型定义（Namespace、API 响应等）
│       └── package.json
├── .github/workflows/              # CI/CD 流水线
├── docker-compose.yml              # 开发环境 Docker 编排
├── docker-compose.prod.yml         # 生产环境 Docker 编排（含 Redis）
├── package.json                    # 根 package.json（workspace 配置）
└── pnpm-workspace.yaml             # pnpm workspace 定义
```

**架构亮点**：
- **后端**：基于 Hono 的轻量级 API 服务，支持自动路由注册、多级缓存（内存+Redis）、统一的错误处理
- **前端**：Vite + React 19 + React Router，Ant Design 6 UI 库，Zustand 状态管理，CSS 变量多主题支持
- **共享**：通过 `@vodhub/shared` 包提供统一的类型定义，确保前后端类型安全

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