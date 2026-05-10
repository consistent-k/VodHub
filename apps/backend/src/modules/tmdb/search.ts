import { Hono } from 'hono';
import type { Context } from 'hono';

import { getTmdbClient, LANGUAGE, normalizeMultiResults } from './client';
import type { TmdbSearchData } from './types';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import logger from '@/utils/logger';

const app = new Hono();

const handler = async (ctx: Context) => {
    try {
        const { query, page = '1' } = ctx.req.query();

        if (!query) {
            return { code: ERROR_CODE, message: 'query parameter is required', data: null };
        }

        logger.info(`TMDB Search - query: ${query}, page: ${page}`);
        const client = getTmdbClient();

        const res = await client.search.multi({ query, page: Number(page), language: LANGUAGE });

        const results = normalizeMultiResults(res.results as unknown as Array<{ media_type?: string } & Record<string, unknown>>);

        const data: TmdbSearchData = {
            results,
            page: res.page,
            totalPages: res.total_pages,
            totalResults: res.total_results
        };

        return { code: SUCCESS_CODE, message: 'success', data };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`TMDB Search - error - ${error instanceof Error ? error.message : String(error)}`);
        return { code: SYSTEM_ERROR_CODE, message: 'TMDB search failed', data: null };
    }
};

app.get('/', async (ctx) => ctx.json(await handler(ctx)));

export default app;
