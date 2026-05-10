<div align="center">
   <h1>VodHub</h1>
   一个视频源聚合解决方案
</div>

## 📋 项目简介

VodHub 是一个完整的视频聚合解决方案，包含两个核心部分：

### 后端服务
- 📦 开箱即用的 Hono API 服务
- ⚙️ CMS 代理系统，支持任意标准 CMS 视频源即插即用
- 🎬 内置 TMDB 元数据集成（趋势、热门、搜索、详情）
- 🛡 使用 TypeScript 开发，保持输出接口的一致性

### 前端应用
- 📦 支持标准 CMS 视频源和 TMDB 元数据
- 🖥 提供视频分类、搜索、详情、播放等页面
- 🐳 支持 PC、手机端页面自适应
- 🎨 内置多套主题 一键切换
- ⚙️ 支持自定义 CMS 视频源管理

## 📸 界面展示

#### 首页
![首页](/apps/frontend/docs/images/home.png)

#### 搜索
![搜索](/apps/frontend/docs/images/search.png)

#### 播放页
![播放页](/apps/frontend/docs/images/play.png)

#### CMS配置、主题选择
![设置页](/apps/frontend/docs/images/theme1.png)

#### Claude风格主题
![claude风格](/apps/frontend/docs/images/theme.png)

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
本地启动前后端，配置为 `/` 即可

#### 方式二
只启动前端，使用第三方提供的VodHub服务，配置为 `http://abc.com` 即可

### 后端 API 使用示例

#### CMS 视频源代理请求
所有 CMS 视频源请求通过统一代理 `/api/vodhub/cms/proxy` 发送，使用请求头指定目标地址和操作：

```bash
# 获取视频源首页分类（通过 CMS 代理）
curl --location 'http://127.0.0.1:8888/api/vodhub/cms/proxy?action=home' \
  --header 'x-proxy-target: https://www.360kan.com'

# 搜索（通过 CMS 代理）
curl --location 'http://127.0.0.1:8888/api/vodhub/cms/proxy?action=search&keyword=钢铁侠&page=1' \
  --header 'x-proxy-target: https://www.360kan.com'

# 获取分类列表（通过 CMS 代理）
curl --location 'http://127.0.0.1:8888/api/vodhub/cms/proxy?action=category&id=1&page=1' \
  --header 'x-proxy-target: https://www.360kan.com'

# 获取详情（通过 CMS 代理）
curl --location 'http://127.0.0.1:8888/api/vodhub/cms/proxy?action=detail&id=12345' \
  --header 'x-proxy-target: https://www.360kan.com'

# 获取播放地址（通过 CMS 代理）
curl --location 'http://127.0.0.1:8888/api/vodhub/cms/proxy?action=play&url=PLAY_URL' \
  --header 'x-proxy-target: https://www.360kan.com'
```

#### TMDB 元数据 API

```bash
# 获取 TMDB 首页数据（趋势、热门电影/剧集、正在上映等）
curl --location 'http://127.0.0.1:8888/api/vodhub/tmdb/home'

# TMDB 多类型搜索
curl --location --request GET 'http://127.0.0.1:8888/api/vodhub/tmdb/search?query=钢铁侠&page=1'

# TMDB 详情查询（电影）
curl --location --request GET 'http://127.0.0.1:8888/api/vodhub/tmdb/detail?id=299534&mediaType=movie'

# 获取 TMDB 配置状态
curl --location --request GET 'http://127.0.0.1:8888/api/vodhub/config'
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
$ docker compose up -d
```

#### 生产环境
使用 `docker-compose.prod.yml` 配置文件，包含 Redis 缓存服务、日志持久化等生产环境优化：

```bash
$ docker compose -f docker-compose.prod.yml up -d
```

**生产环境配置说明：**
- **服务架构**：包含 frontend、backend、redis 三个服务
- **端口映射**：
  - 前端：127.0.0.1:3000 → 容器 80 端口（如需外部访问可改为 `3000:80`）
  - 后端：127.0.0.1:8888 → 容器 8888 端口
  - Redis：127.0.0.1:6379 → 容器 6379 端口（仅本地访问）
- **环境变量**：
  - `REDIS_URL=redis://redis:6379` - Redis 连接地址
  - `CACHE_TTL=60` - 缓存时间（秒）
  - `BANNED_KEYWORDS=测试` - 禁用关键词
  - `TMDB_ENABLED=true` - 启用 TMDB 元数据（可选）
  - `TMDB_API_TOKEN=xxx` - TMDB API 访问令牌（可选）
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
│   │   │   ├── api/                # API 入口（config 配置端点）
│   │   │   ├── modules/            # 业务模块
│   │   │   │   ├── cms/            # CMS 代理模块（统一处理所有 CMS 请求）
│   │   │   │   └── tmdb/           # TMDB 模块（home, search, detail）
│   │   │   ├── config/             # 配置（端口、缓存、TMDB 设置等）
│   │   │   ├── constant/           # 常量定义（状态码、消息、User-Agent 等）
│   │   │   ├── types/              # 后端类型定义（CMS 响应类型等）
│   │   │   ├── middleware/         # 中间件（缓存、CORS、压缩、JSON 序列化）
│   │   │   └── utils/              # 工具函数
│   │   │       ├── cms/            # CMS 代理处理器（home, homeVod, category, detail, play, search）
│   │   │       ├── cache/          # 缓存工具（内存 LRU + Redis）
│   │   │       ├── filters/        # 数据过滤/规范化
│   │   │       ├── format/         # 格式化工具
│   │   │       ├── headers/        # HTTP 头常量
│   │   │       └── logger/         # 日志工具
│   │   ├── Dockerfile              # 容器化配置
│   │   └── package.json
│   └── frontend/                   # 前端应用 (Vite + React 19 + React Router)
│       ├── src/
│       │   ├── components/         # 可复用组件
│       │   │   ├── CmsManagement/  # 视频源管理（CRUD）
│       │   │   ├── FeaturedCarousel/ # TMDB 精选轮播
│       │   │   ├── MediaList/      # 通用媒体列表
│       │   │   ├── SearchTmdb/     # TMDB 全局搜索
│       │   │   ├── SiteHeader/     # 站点导航（含 TMDB/CMS 切换）
│       │   │   ├── VodPalyer/      # 视频播放器
│       │   │   ├── VodSites/       # 视频源站点选择器
│       │   │   ├── VodTypes/       # 分类选择器
│       │   │   └── ThemeSelector/  # 主题切换
│       │   ├── hooks/              # 自定义 Hooks（useTmdb 等）
│       │   ├── pages/              # React Router 页面路由
│       │   │   ├── home/           # 首页（TMDB 轮播 + CMS 内容）
│       │   │   ├── category/       # 分类页面
│       │   │   ├── detail/         # 详情页面
│       │   │   ├── cms/            # 视频源管理页面
│       │   │   └── setting/        # 设置页面
│       │   ├── store/              # Zustand 状态管理
│       │   │   ├── useVideoSourcesStore.ts  # 视频源管理（替代旧 useCmsStore）
│       │   │   ├── useTmdbStore.ts         # TMDB 首页数据
│       │   │   ├── useTmdbDetailStore.ts   # TMDB 详情数据
│       │   │   ├── useTmdbMatchStore.ts    # TMDB-CMS 匹配缓存
│       │   │   └── useAppConfigStore.ts    # 应用配置
│       │   ├── services/           # API 服务层
│       │   ├── utils/              # 工具函数（tmdb, tmdb-match, request）
│       │   ├── themes/             # 多主题定义
│       │   └── App.tsx             # 应用根组件
│       ├── conf/                   # 配置文件（nginx.conf）
│       ├── index.html              # 入口 HTML
│       ├── Dockerfile              # 容器化配置
│       └── package.json
├── packages/
│   └── shared/                     # 共享类型和工具
│       ├── src/types/
│       │   ├── index.ts            # 核心类型（Namespace, HomeData, ApiResponse 等）
│       │   └── video-source.ts     # 视频源类型（VideoSource, CRUD 输入类型）
│       └── package.json
├── .github/workflows/              # CI/CD 流水线
├── docker-compose.yml              # 开发环境 Docker 编排
├── docker-compose.prod.yml         # 生产环境 Docker 编排（含 Redis）
├── package.json                    # 根 package.json（workspace 配置）
└── pnpm-workspace.yaml             # pnpm workspace 定义
```

**架构亮点**：
- **后端**：基于 Hono 的轻量级 API 服务，三大模块（config/cms/tmdb）显式注册，支持多级缓存（内存+Redis）、统一错误处理
- **CMS 代理**：所有 CMS 视频源通过统一代理入口 `/api/vodhub/cms/proxy` 处理，无需为每个视频源单独编写后端路由
- **前端**：Vite + React 19 + React Router，Ant Design 6 UI 库，Zustand 状态管理，CSS 变量多主题支持
- **TMDB 集成**：后端直接调用 TMDB API，提供首页推荐、多类型搜索和详情数据，与 CMS 源互补
- **视频源管理**：前端通过 `useVideoSourcesStore` 统一管理所有视频源（内置 + 自定义），支持 CRUD 和批量导入
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
4. 用户使用本项目所产生的任何风险或损失（包括但不限于:系统故障、隐私泄露等），开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本项目即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。