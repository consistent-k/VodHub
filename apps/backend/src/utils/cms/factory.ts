import type { Context } from 'hono';
import type { Namespace, Route } from '@/types';
import { handler as categoryHandler } from '@/utils/cms/category';
import { handler as detailHandler } from '@/utils/cms/detail';
import { handler as homeHandler } from '@/utils/cms/home';
import { handler as homeVodHandler } from '@/utils/cms/homeVod';
import { handler as playHandler } from '@/utils/cms/play';
import { handler as searchHandler } from '@/utils/cms/search';

export function createCMSRoutes(namespace: Namespace): Route[] {
    const { name } = namespace;

    return [
        {
            path: '/home',
            name: 'home',
            example: `/${name}/home`,
            description: '首页分类列表',
            handler: (ctx: Context) => homeHandler(ctx, namespace)
        },
        {
            path: '/homeVod',
            name: 'homeVod',
            example: `/${name}/homeVod`,
            description: '最近更新',
            handler: (ctx: Context) => homeVodHandler(ctx, namespace)
        },
        {
            path: '/category',
            name: 'category',
            example: `/${name}/category`,
            description: '获取分类列表',
            handler: (ctx: Context) => categoryHandler(ctx, namespace),
            method: 'POST' as const
        },
        {
            path: '/detail',
            name: 'detail',
            example: `/${name}/detail`,
            description: '获取详情',
            handler: (ctx: Context) => detailHandler(ctx, namespace),
            method: 'POST' as const
        },
        {
            path: '/play',
            name: 'play',
            example: `/${name}/play`,
            description: '获取播放地址',
            handler: (ctx: Context) => playHandler(ctx, namespace),
            method: 'POST' as const
        },
        {
            path: '/search',
            name: 'search',
            example: `/${name}/search`,
            description: '关键词搜索',
            handler: (ctx: Context) => searchHandler(ctx, namespace),
            method: 'POST' as const
        }
    ];
}
