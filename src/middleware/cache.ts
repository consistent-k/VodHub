import dayjs from 'dayjs';
import type { MiddlewareHandler } from 'hono';

import RequestInProgressError from '@/errors/types/request-in-progress';
import cache from '@/utils/cache';

const middleware: MiddlewareHandler = async (ctx, next) => {
    const cacheKey = `vodspider:redis-cache:${ctx.req.path}`; // 缓存的 key
    const pathKey = `vodspider:path-requested:${ctx.req.path}`; // 请求的 key

    const isRequesting = await cache.get(pathKey); // 判断是否正在请求

    if (isRequesting === '1') {
        let retryTimes = 10;
        let bypass = false;
        while (retryTimes > 0) {
            await new Promise((resolve) => setTimeout(resolve, 6000));
            if ((await cache.get(pathKey)) !== '1') {
                bypass = true;
                break;
            }
            retryTimes--;
        }
        if (!bypass) {
            throw new RequestInProgressError('This path is currently fetching, please come back later!');
        }
    }

    const value: string | null = await cache.get(cacheKey);

    if (value) {
        ctx.status(200);
        ctx.header('Vodspider-Cache-Status', 'HIT');
        ctx.set('data', JSON.parse(value));
        await next();
        return;
    }

    await cache.set(pathKey, '1');
    try {
        await next();
    } catch (error) {
        await cache.set(pathKey, '0');
        throw error;
    }

    const data: any = ctx.get('data');
    if (ctx.res.headers.get('Cache-Control') !== 'no-cache' && data) {
        data.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        ctx.set('data', data);
        const body = JSON.stringify(data);
        await cache.set(cacheKey, body);
    }
    await cache.set(pathKey, '0');
};

export default middleware;
