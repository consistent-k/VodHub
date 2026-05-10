## 📝 开始之前

> 要新建一个VodHub的路由（视频源），您需要熟练使用Git、Node.js 和 TypeScript。

- 参照 [README.md](README.md) 中的 `开发环境` 进行环境搭建
- 学习如何提交PR: [视频链接](https://www.bilibili.com/video/BV1ei4y1s7pU/)
- 提交规范：[Commit message 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 📚 基本概念

### 1. 视频源
VodHub中的视频源是指一个独立的CMS视频数据提供商。每个视频源由一个 `Namespace` 对象标识，包含名称（name）、地址（url）和描述（description）。

### 2. 视频源类型

VodHub 支持两种视频源：

#### 类型一：自定义CMS视频源（推荐）
适用于标准CMS类型的视频源（使用 `api.php/provide/vod` 接口），只需创建一个文件即可完成：
- `namespace.ts` - 声明视频源的基本信息

所有CMS标准操作（首页、分类、详情、搜索、播放）由后端的CMS代理系统自动处理，无需手动编写每个路由。

#### 类型二：TMDB元数据
TMDB是内置的元数据提供商，无需额外配置即可使用。包含：
- 首页推荐（趋势、热门电影/剧集、正在上映、即将上映、评分最高）
- 多类型搜索
- 详情查看

## 🔨 创建自定义CMS视频源

### 步骤 1：创建 namespace.ts

在 `apps/frontend/src/data/` 目录下（或通过前端CMS管理界面）添加视频源配置：

```typescript
{
    id: 'mymovie',           // 视频源唯一标识
    name: '我的电影网',       // 显示名称
    url: 'https://mymovie.com', // 视频源网站地址
    description: '我的电影网',  // 描述
    enabled: true            // 是否启用
}
```

### 步骤 2：使用视频源

前端通过 `useVideoSourcesStore` 管理所有视频源。创建后，视频源会自动出现在站点选择器中。

所有CMS请求通过统一代理发送：
- **API路径**: `/api/vodhub/cms/proxy`
- **请求头**:
  - `x-proxy-target`: 视频源的基地址（如 `https://mymovie.com`）
  - `x-proxy-action`: 操作类型（`home`, `homeVod`, `category`, `detail`, `play`, `search`）
- **查询参数**: 根据操作类型传递（如 `keyword`, `id`, `page` 等）

### 工作原理

前端 → `/api/vodhub/cms/proxy`（带 `x-proxy-target` 和 `x-proxy-action` 头）
  → 后端代理处理器（`modules/cms/proxy.ts`）
    → 对应的CMS工具函数（`utils/cms/{action}/index.ts`）
      → 目标CMS网站的实际API请求

## 📂 后端目录结构

```
apps/backend/src/
├── api/
│   └── config/           # TMDB配置API
├── modules/
│   ├── cms/proxy.ts      # CMS代理路由器（所有CMS请求的统一入口）
│   └── tmdb/
│       ├── app.ts        # TMDB路由设置
│       ├── client.ts     # TMDB客户端和数据规范化函数
│       ├── detail.ts     # TMDB详情处理器
│       ├── home.ts       # TMDB首页处理器
│       ├── search.ts     # TMDB搜索处理器
│       └── types.ts      # TMDB专用类型
├── types/
│   ├── cms.ts            # CMS响应类型
│   ├── error.ts          # 错误类型
│   └── index.ts          # 类型汇总（从 @vodhub/shared 重导出）
├── utils/
│   ├── cache/            # 缓存工具
│   ├── cms/
│   │   ├── request.ts    # Axios实例和CMSResponse类型
│   │   ├── home/         # 首页数据处理器
│   │   ├── homeVod/      # 最近更新处理器
│   │   ├── category/     # 分类处理器
│   │   ├── detail/       # 详情处理器
│   │   ├── play/         # 播放地址处理器
│   │   └── search/       # 搜索处理器
│   ├── common-utils.ts   # 通用工具函数
│   ├── filters/          # 数据过滤/规范化
│   ├── format/           # 格式化工具
│   ├── headers/          # HTTP头常量
│   └── logger/           # 日志工具
├── constant/
│   ├── code.ts           # 状态码
│   ├── message.ts        # 消息常量
│   ├── userAgent.ts      # User-Agent字符串
│   └── word.ts           # 关键词常量
├── config/
│   └── index.ts          # 配置（端口、缓存、TMDB设置等）
├── app.tsx               # 主应用，路由注册
└── index.ts              # 应用入口
```

## 🛠 创建自定义路由（高级）

如果视频源不符合标准CMS格式，可以创建自定义的CMS处理器：

### 步骤 1：在 `utils/cms/` 下创建处理器

参照现有处理器（如 `home/index.ts`）的模式，创建自定义操作处理器：

```typescript
import type { Context } from 'hono';
import type { Namespace } from '@/types';
import { SUCCESS_CODE, ERROR_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { YOUR_MESSAGE } from '@/constant/message';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace: Namespace) => {
    try {
        logger.info(`${YOUR_MESSAGE.INFO} - ${namespace.name}`);
        // 调用目标API并处理响应
        return {
            code: SUCCESS_CODE,
            message: YOUR_MESSAGE.SUCCESS,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${YOUR_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: YOUR_MESSAGE.ERROR,
            data: []
        };
    }
};
```

### 步骤 2：在 `modules/cms/proxy.ts` 中注册新action

在proxy.ts的switch语句中添加新action的case：

```typescript
case 'yourAction':
    result = ctx.json(await yourHandler(ctx, namespace));
    break;
```

## 🧪 测试视频源

启动开发服务器后，测试视频源：

```bash
# 启动服务
pnpm dev:backend

# 测试首页（通过代理）
curl --location 'http://localhost:8888/api/vodhub/cms/proxy?action=home' \
  --header 'x-proxy-target: https://mymovie.com'

# 测试搜索
curl --location 'http://localhost:8888/api/vodhub/cms/proxy?action=search&keyword=测试&page=1' \
  --header 'x-proxy-target: https://mymovie.com'

# 测试TMDB首页
curl --location 'http://localhost:8888/api/vodhub/tmdb/home'
```

## 📦 提交代码

1. 确保代码符合项目规范
   ```bash
   pnpm --filter @vodhub/backend lint
   ```

2. 进行类型检查
   ```bash
   pnpm --filter @vodhub/backend typecheck
   ```

3. 提交代码
   ```bash
   pnpm commit
   ```

4. 创建 Pull Request 到 VodHub 仓库

## ⚠️ 注意事项

1. **错误处理**：所有处理器必须使用 try/catch 包裹，返回统一格式
2. **日志记录**：在处理器开头添加 `logger.info`，在 catch 中添加 `logger.error`
3. **缓存控制**：在错误时设置 `ctx.res.headers.set('Cache-Control', 'no-cache')`
4. **类型安全**：使用 TypeScript 类型定义，确保类型安全
5. **CMS代理**：所有CMS请求现在通过统一代理 `/api/vodhub/cms/proxy` 处理，不再需要为每个视频源创建单独的路由文件
6. **视频源管理**：视频源配置由前端 `useVideoSourcesStore` 管理（Zustand + localStorage），不再使用旧的 `useCmsStore`