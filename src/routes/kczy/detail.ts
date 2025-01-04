import { Context } from 'hono';

import { namespace } from './namespace';

import { DetailRoute } from '@/types';
import { handler } from '@/utils/cms/detail';

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/kczy/detail',
    description: `获取详情`,
    handler: (ctx: Context) => handler(ctx, namespace),
    method: 'POST'
};
