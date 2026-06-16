import { Hono } from 'hono';
import type { Context } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import { trimTrailingSlash } from 'hono/trailing-slash';

import { SUCCESS_CODE, ERROR_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { MATCH_MESSAGE } from '@/constant/match';
import logger from '@/utils/logger';
import { matchAll, matchStream } from '@/utils/match';
import type { MatchRequest } from '@/utils/match/types';

const matchApp = new Hono();

matchApp.use('/*', cors());
matchApp.use(trimTrailingSlash());
matchApp.use(compress());

matchApp.post('/', async (ctx: Context) => {
    try {
        const body = await ctx.req.json<MatchRequest>();

        if (!body.sources?.length) {
            return ctx.json({ code: ERROR_CODE, message: 'sources is required', data: [] });
        }
        if (!body.title) {
            return ctx.json({ code: ERROR_CODE, message: 'title is required', data: [] });
        }

        logger.info(`${MATCH_MESSAGE.INFO} - tmdbId=${body.tmdbId}, mediaType=${body.mediaType}, sources=${body.sources.length}`);

        const { results } = await matchAll(body);

        return ctx.json({
            code: SUCCESS_CODE,
            message: MATCH_MESSAGE.SUCCESS,
            data: results
        });
    } catch (error) {
        logger.error(`${MATCH_MESSAGE.ERROR} - ${error instanceof Error ? error.message : String(error)}`);
        return ctx.json({
            code: SYSTEM_ERROR_CODE,
            message: MATCH_MESSAGE.ERROR,
            data: []
        });
    }
});

matchApp.post('/stream', async (ctx: Context) => {
    try {
        const body = await ctx.req.json<MatchRequest>();

        if (!body.sources?.length) {
            return ctx.json({ code: ERROR_CODE, message: 'sources is required', data: [] });
        }
        if (!body.title) {
            return ctx.json({ code: ERROR_CODE, message: 'title is required', data: [] });
        }

        logger.info(`${MATCH_MESSAGE.INFO}(SSE) - tmdbId=${body.tmdbId}, mediaType=${body.mediaType}, sources=${body.sources.length}`);

        ctx.header('Content-Type', 'text/event-stream');
        ctx.header('Cache-Control', 'no-cache');
        ctx.header('Connection', 'keep-alive');
        ctx.header('X-Accel-Buffering', 'no');

        return streamSSE(ctx, async (stream) => {
            try {
                const { summary } = await matchStream(body, async (sourceResult) => {
                    await stream.writeSSE({
                        event: 'match',
                        data: JSON.stringify(sourceResult)
                    });
                });

                await stream.writeSSE({
                    event: 'complete',
                    data: JSON.stringify(summary)
                });
            } catch (error) {
                logger.error(`${MATCH_MESSAGE.ERROR}(SSE) - ${error instanceof Error ? error.message : String(error)}`);
                await stream.writeSSE({
                    event: 'error',
                    data: JSON.stringify({ error: MATCH_MESSAGE.ERROR })
                });
            }
        });
    } catch (error) {
        logger.error(`${MATCH_MESSAGE.ERROR}(SSE) - ${error instanceof Error ? error.message : String(error)}`);
        return ctx.json({
            code: SYSTEM_ERROR_CODE,
            message: MATCH_MESSAGE.ERROR,
            data: []
        });
    }
});

export default matchApp;
