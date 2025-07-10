import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import type { MiddlewareHandler } from 'hono';

import RequestInProgressError from '@/types/error';
import cache from '@/utils/cache';
import logger from '@/utils/logger';

const { Hex } = CryptoJS.enc;

const middleware: MiddlewareHandler = async (ctx, next) => {
    const method = ctx.req.method;
    const path = ctx.req.path;
    let bodyHash = '';

    if (method === 'POST') {
        const body = await ctx.req.json();
        ctx.set('parsedBody', body);
        bodyHash = '-' + CryptoJS.MD5(JSON.stringify(body)).toString(Hex);
    }

    const cacheKey = `vod-hub:redis-cache:${path}${bodyHash}`;
    const pathKey = `vod-hub:path-requested:${path}${bodyHash}`;

    const isRequesting = await cache.get(pathKey); // 判断是否正在请求

    if (isRequesting === '1') {
        let retryTimes = 10;
        let bypass = false;
        while (retryTimes > 0) {
            await new Promise((resolve) => setTimeout(resolve, 6000));
            const currentStatus = await cache.get(pathKey);
            if (currentStatus !== '1') {
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
        logger.info(`Cache hit for ${ctx.req.method} ${ctx.req.path}`);
        ctx.set('data', JSON.parse(value));
        await next();
        return;
    }

    await cache.set(pathKey, '1');
    try {
        await next();
        const data = ctx.get('data');
        if (ctx.res.headers.get('Cache-Control') !== 'no-cache' && data) {
            data.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
            ctx.set('data', data);
            await cache.set(cacheKey, JSON.stringify(data));
        }
    } catch (error) {
        throw error;
    } finally {
        await cache.set(pathKey, '0');
    }
};

export default middleware;
