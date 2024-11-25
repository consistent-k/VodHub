import { Context } from 'hono';

import { namespace } from './namespace';

import { PlayRoute } from '@/types';
import { handler } from '@/utils/cms/play';

export const route: PlayRoute = {
    path: '/play',
    name: 'play',
    example: '/feifan/play',
    description: `获取播放地址`,
    handler: (ctx: Context) => handler(ctx, namespace),
    method: 'POST'
};
