import { Context } from 'hono';

import { namespace } from './namespace';

import { HomeVodRoute } from '@/types';
import { handler } from '@/utils/cms/homeVod';

export const route: HomeVodRoute = {
    path: '/homeVod',
    name: 'homeVod',
    example: '/ukzy/homeVod',
    description: `最近更新`,
    handler: (ctx: Context) => handler(ctx, namespace)
};
