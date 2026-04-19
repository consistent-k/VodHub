import { Hono } from 'hono';
import type { Context } from 'hono';

import type { Namespace } from '@/types';
import { handler as categoryHandler } from '@/utils/cms/category';
import { handler as detailHandler } from '@/utils/cms/detail';
import { handler as homeHandler } from '@/utils/cms/home';
import { handler as homeVodHandler } from '@/utils/cms/homeVod';
import { handler as playHandler } from '@/utils/cms/play';
import { handler as searchHandler } from '@/utils/cms/search';
import logger from '@/utils/logger';

const app = new Hono();

const createNamespace = (target: string): Namespace => ({
    name: 'custom',
    url: target
});

app.get('/', async (ctx: Context): Promise<Response> => {
    const target = ctx.req.header('x-proxy-target') || '';
    const action = ctx.req.header('x-proxy-action') || '';

    logger.info(`Proxy request: target=${target}, action=${action}`);

    if (!target) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        return ctx.json({ code: -1, message: 'header x-proxy-target is required', data: [] });
    }

    if (!action) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        return ctx.json({ code: -1, message: 'header x-proxy-action is required', data: [] });
    }

    const namespace = createNamespace(target);

    let result: Response;

    switch (action) {
        case 'homeVod':
            result = ctx.json(await homeVodHandler(ctx, namespace));
            break;
        case 'home':
            result = ctx.json(await homeHandler(ctx, namespace));
            break;
        case 'detail':
            result = ctx.json(await detailHandler(ctx, namespace));
            break;
        case 'category':
            result = ctx.json(await categoryHandler(ctx, namespace));
            ctx.res.headers.set('Cache-Control', 'no-cache');
            break;
        case 'play':
            result = ctx.json(await playHandler(ctx, namespace));
            ctx.res.headers.set('Cache-Control', 'no-cache');
            break;
        case 'search':
            result = ctx.json(await searchHandler(ctx, namespace));
            ctx.res.headers.set('Cache-Control', 'no-cache');
            break;
        default:
            ctx.res.headers.set('Cache-Control', 'no-cache');
            result = ctx.json({ code: -1, message: 'Unknown action: ' + action, data: [] });
            break;
    }

    return result;
});

export default app;
