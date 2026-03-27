## 📝 开始之前

> 要新建一个VodHub的路由，您需要熟练使用Git、Node.js 和 TypeScript。

- 参照 [README.md](README.md) 中的 `开发环境` 进行环境搭建
- 学习如何提交PR: [视频链接](https://www.bilibili.com/video/BV1ei4y1s7pU/)
- 提交规范：[Commit message 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 📚 基本概念

### 1. 路由
VodHub中的路由是指一个独立的视频源，例如：`360kan`、`360zy`等。

### 2. 路由类型

VodHub 支持两种路由创建方式：

#### 方式一：CMS 路由（推荐）
适用于标准 CMS 类型的视频源，只需创建两个文件即可完成路由：
- `namespace.ts` - 声明路由的基本信息
- `index.ts` - 使用工厂函数自动生成所有路由

#### 方式二：自定义路由
适用于非标准 CMS 或需要特殊处理的视频源，需要手动创建各个路由文件：
- `namespace.ts` - 声明路由的基本信息
- `home.ts` - 首页分类
- `homeVod.ts` - 最近更新
- `category.ts` - 分类查询
- `detail.ts` - 视频详情
- `play.ts` - 播放地址
- `search.ts` - 关键词搜索

## 🔨 方式一：创建 CMS 路由（推荐）

### 步骤 1：创建目录和 namespace.ts

在 `apps/backend/src/routes` 目录下新建文件夹（如 `mymovie`），并创建 `namespace.ts`：

```typescript
import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: 'mymovie',           // 路由名称（英文）
    url: 'https://mymovie.com', // 视频源网站地址
    description: '我的电影网'    // 描述
};
```

### 步骤 2：创建 index.ts

在同目录下创建 `index.ts`，使用工厂函数自动生成所有路由：

```typescript
import { namespace } from './namespace';
import { createCMSRoutes } from '@/utils/cms/factory';

export const routes = createCMSRoutes(namespace);
```

### 步骤 3：完成

就这样！CMS 工厂函数会自动为你创建以下路由：
- `/{name}/home` - 首页分类列表
- `/{name}/homeVod` - 最近更新
- `/{name}/category` - 获取分类列表（POST）
- `/{name}/detail` - 获取详情（POST）
- `/{name}/play` - 获取播放地址（POST）
- `/{name}/search` - 关键词搜索（POST）

## 🔨 方式二：创建自定义路由

如果视频源不符合标准 CMS 格式，可以手动创建各个路由文件。

### 步骤 1：创建目录和 namespace.ts

```typescript
import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: '360kan',
    url: 'https://www.360kan.com',
    description: '360影视'
};
```

### 步骤 2：创建路由文件

以 `home.ts` 为例：

```typescript
import type { Context } from 'hono';
import { namespace } from './namespace';
import { SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import type { HomeData, HomeRoute } from '@/types';
import { filterHomeData } from '@/utils/filters';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);

        // 在这里编写请求源网站的代码
        // 按照 HomeData 的格式返回数据
        const data: HomeData[] = [
            {
                type_id: '1',
                type_name: '电影',
                filters: [
                    {
                        type: 'class',
                        children: [
                            { label: '全部', value: '全部' },
                            { label: '喜剧', value: '喜剧' },
                            { label: '动作', value: '动作' }
                        ]
                    }
                ]
            }
        ];

        return {
            code: SUCCESS_CODE,
            message: HOME_MESSAGE.SUCCESS,
            data: filterHomeData(data)
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${error instanceof Error ? error.message : String(error)}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/360kan/home',
    description: '首页分类列表',
    handler
};
```

### 步骤 3：创建其他路由文件

参照 `home.ts` 的模式，创建其他路由文件：
- `homeVod.ts` - 最近更新
- `category.ts` - 分类查询（POST）
- `detail.ts` - 视频详情（POST）
- `play.ts` - 播放地址（POST）
- `search.ts` - 关键词搜索（POST）

## 📂 路由目录结构示例

### CMS 路由（推荐）
```
apps/backend/src/routes/
└── 360zy/
    ├── namespace.ts
    └── index.ts
```

### 自定义路由
```
apps/backend/src/routes/
└── 360kan/
    ├── namespace.ts
    ├── home.ts
    ├── homeVod.ts
    ├── category.ts
    ├── detail.ts
    ├── play.ts
    └── search.ts
```

## 🔧 常用工具和类型

### 状态码
```typescript
import { SUCCESS_CODE, ERROR_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
```

- `SUCCESS_CODE (0)` - 成功
- `ERROR_CODE (-1)` - 业务逻辑错误
- `SYSTEM_ERROR_CODE (-2)` - 系统异常

### 消息常量
```typescript
import { HOME_MESSAGE, SEARCH_MESSAGE, DETAIL_MESSAGE } from '@/constant/message';
```

### 类型定义
```typescript
import type { 
    HomeRoute, 
    HomeVodRoute, 
    CategoryRoute, 
    DetailRoute, 
    PlayRoute, 
    SearchRoute,
    HomeData,
    CategoryVodData,
    DetailData,
    PlayData,
    SearchData
} from '@/types';
```

### 工具函数
```typescript
import { filterHomeData } from '@/utils/filters';  // 过滤首页数据
import logger from '@/utils/logger';                // 日志工具
```

## 🧪 测试路由

启动开发服务器后，测试你的路由：

```bash
# 启动服务
pnpm dev:backend

# 测试首页接口
curl http://localhost:8888/api/vodhub/mymovie/home

# 测试搜索接口
curl -X POST http://localhost:8888/api/vodhub/mymovie/search \
  -H "Content-Type: application/json" \
  -d '{"keyword": "测试", "page": 1}'
```

## 📦 提交路由

当您完成新路由的开发后：

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

1. **错误处理**：所有 handler 必须使用 try/catch 包裹，返回统一格式
2. **日志记录**：在 handler 开头添加 `logger.info`，在 catch 中添加 `logger.error`
3. **缓存控制**：在错误时设置 `ctx.res.headers.set('Cache-Control', 'no-cache')`
4. **数据过滤**：首页数据使用 `filterHomeData` 进行过滤
5. **类型安全**：使用 TypeScript 类型定义，确保类型安全

## 🔗 相关资源

- [VodHub API 文档](README.md#后端-api-使用示例)
- [类型定义文件](apps/backend/src/types/index.ts)
- [CMS 工厂函数](apps/backend/src/utils/cms/factory.ts)
- [现有路由示例](apps/backend/src/routes/)