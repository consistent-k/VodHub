import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import type { MiddlewareHandler } from 'hono';

import RequestInProgressError from '@/types/error';
import cache from '@/utils/cache';
import logger from '@/utils/logger';

const { Hex } = CryptoJS.enc;

const middleware: MiddlewareHandler = async (ctx, next) => {
    const path = ctx.req.path;
    const query = ctx.req.query();
    const queryHash = '-' + CryptoJS.MD5(JSON.stringify(query)).toString(Hex);

    let cacheKey = `vod-hub:redis-cache:${path}${queryHash}`;
    let pathKey = `vod-hub:path-requested:${path}${queryHash}`;

    if (path === '/api/vodhub/proxy' || path === '/proxy') {
        const target = ctx.req.header('x-proxy-target') || '';
        const action = ctx.req.header('x-proxy-action') || '';
        const headerHash = '-' + CryptoJS.MD5(`${target}:${action}`).toString(Hex);
        cacheKey = `vod-hub:redis-cache:${path}${headerHash}${queryHash}`;
        pathKey = `vod-hub:path-requested:${path}${headerHash}${queryHash}`;
    }

    const isRequesting = await cache.get(pathKey);

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

    const value = await cache.get(cacheKey);

    if (value) {
        ctx.status(200);
        ctx.header('Vod-Hub-Cache-Status', 'HIT');
        logger.info(`Cache hit for ${ctx.req.method} ${ctx.req.path}`);
        try {
            ctx.set('data', JSON.parse(value as string));
        } catch {
            logger.error(`Cache parse error for ${cacheKey}`);
        }
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
        logger.error(`Cache middleware error for ${path}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    } finally {
        await cache.set(pathKey, '0');
    }
};

export default middleware;
