## 📝 开始之前
> 要新建一个VodHub的路由，您需要熟练使用Git、Node.js 和 TypeScript。

- 参照 [README.md](README.md) 中的 `开发环境` 进行环境搭建
- 学习如何提交PR: [视频链接](https://www.bilibili.com/video/BV1ei4y1s7pU/)
- 提交规范：[Commit message 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 📚 基本概念

### 1. 路由
VodHub中的路由是指一个独立的视频源，例如：`tiantian`、`nangua`等。

### 2. 路由规范
- 在 `src/routes` 目录下新建一个文件夹，文件夹名称即为路由名称。
- 一个路由文件夹下我们约定包含以下文件：
    - `namespace.ts` 用于声明路由的基本信息。
    - `home.ts` 用于获取首页分类。
    - `homeVod.ts` 用于获取最近更新。
    - `category.ts` 用于按视频分类查询。
    - `detail.ts` 用于按视频ID获取详情。
    - `play.ts` 用于获取播放地址。
    - `search.ts` 用于关键词搜索。
    - `request.ts` （非必须）用于自定义本视频源的请求。

### 3. 路由规范示例
```bash
src/routes
├── tiantian
│   ├── category.ts
│   ├── detail.ts
│   ├── home.ts
│   ├── homeVod.ts
│   ├── namespace.ts
│   ├── play.ts
│   └── search.ts
```

## 🔨 新建路由
- 在 `src/routes` 目录下新建一个文件夹，`mymovie`。
- 在 `mymovie` 文件夹下新建 `namespace.ts` 文件，内容如下：

```typescript
import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: '我的电影',
    url: 'https://mymovie.com',
    description: '我的电影网'
};
```

- 在 `mymovie` 文件夹下新建 `home.ts` 文件，内容如下：

```typescript
import { namespace } from './namespace';
import { HomeData, HomeRoute } from '@/types';

const handler = async (ctx) => {
    // 在这里可以编写请求源网站的代码，按照HomeData的格式返回数据
    // 可以使用ctx获取到请求参数，控制缓存等

    // 以下是模拟数据
    const data: HomeData[] = [
        {
            type_id: 1,
            type_name: '电影',
            extend: ['喜剧', '动作', '爱情'],
            area: ['内地', '美国', '韩国'],
            lang: ['中文', '英文'],
            year: ['2024', '2023', '2022'],
        },
        {
            type_id: 2,
            type_name: '电视剧',
            extend: ['偶像', '古装', '警匪'],
            area: ['内地', '美国', '韩国'],
            lang: ['中文', '英文'],
            year: ['2024', '2023', '2022'],
        }
    ];
    return data;
};

export const route: HomeRoute = {
    path: '/home', // 路由路径
    name: 'home', // 路由名称
    example: '/mymovie/home', // 示例路径
    description: `首页分类列表`, // 路由描述
    handler // 路由处理函数
};
```

- 打开浏览器或者接口测试工具，访问 `http://localhost:8888/mymovie/home`，查看返回结果。

- 其他路由实现方式类似。

## 📦 提交路由
当您完成新路由的开发后，您需要提交一个Pull Request(PR)到VodHub。

