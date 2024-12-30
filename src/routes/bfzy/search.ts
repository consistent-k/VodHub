import { Context } from 'hono';

import { namespace } from './namespace';

import { SearchRoute } from '@/types';
import { handler } from '@/utils/cms/search';

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/bfzy/search',
    description: `关键词搜索`,
    handler: (ctx: Context) => handler(ctx, namespace),
    method: 'POST'
};
