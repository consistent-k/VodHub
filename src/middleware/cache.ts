import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import type { MiddlewareHandler } from 'hono';

import RequestInProgressError from '@/types/error';
import cache from '@/utils/cache';

const { Hex } = CryptoJS.enc;

const middleware: MiddlewareHandler = async (ctx, next) => {
    let cacheKey = `vod-hub:redis-cache:`; // 缓存的 key
    let pathKey = `vod-hub:path-requested:`; // 请求的 key
    switch (ctx.req.method) {
        case 'POST':
            const body = await ctx.req.json();
            const contentMD5 = CryptoJS.MD5(JSON.stringify(body)).toString(Hex);
            cacheKey += `${ctx.req.path}-${contentMD5}`;
            pathKey += `${ctx.req.path}-${contentMD5}`;
            break;
        default:
            cacheKey += ctx.req.path;
            pathKey += ctx.req.path;
            break;
    }

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
        ctx.header('Vod-Hub-Cache-Status', 'HIT');
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

    // @ts-ignore
    // eslint-disable-next-line
    const data: any = ctx.get('data');
    if (ctx.res.headers.get('Cache-Control') !== 'no-cache' && data) {
        data.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        ctx.set('data', data);
        const body = JSON.stringify(data);
        await cache.set(cacheKey, body);
    }
    await cache.set(pathKey, '0');
};

export default middleware;
