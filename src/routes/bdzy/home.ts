import { Context } from 'hono';

import { namespace } from './namespace';

import { HomeRoute } from '@/types';
import { handler } from '@/utils/cms/home';

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/bdzy/home',
    description: `首页分类列表`,
    handler: (ctx: Context) => handler(ctx, namespace)
};
