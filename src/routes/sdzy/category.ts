import { Context } from 'hono';

import { namespace } from './namespace';

import { CategoryRoute } from '@/types';
import { handler } from '@/utils/cms/category';

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/sdzy/category',
    description: `获取分类列表`,
    handler: (ctx: Context) => handler(ctx, namespace),
    method: 'POST'
};
