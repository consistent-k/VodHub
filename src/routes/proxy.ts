import { Hono } from 'hono';
import type { Context } from 'hono';
import queryString from 'query-string';

import { omitHeaders } from '@/utils/headers';
import logger from '@/utils/logger';

const ALLOWED_PROXY_TARGETS = (process.env.ALLOWED_PROXY_TARGETS || '').split(',').filter(Boolean);

const app = new Hono();

function isAllowedTarget(target: string): boolean {
    if (ALLOWED_PROXY_TARGETS.length === 0) {
        return false;
    }
    try {
        const url = new URL(target);
        return ALLOWED_PROXY_TARGETS.some((allowed) => url.hostname.endsWith(allowed));
    } catch {
        return false;
    }
}

async function handleProxyRequest(ctx: Context, method = 'GET') {
    const query = ctx.req.query();
    const strParams = queryString.stringify(query);
    const target = ctx.req.header('x-proxy-target') || '';
    const path = ctx.req.header('x-proxy-path');

    if (!target) {
        return ctx.json({ error: 'header x-proxy-target is required' }, 400);
    }
    if (!path) {
        return ctx.json({ error: 'header x-proxy-path is required' }, 400);
    }
    if (!isAllowedTarget(target)) {
        return ctx.json({ error: 'target not allowed' }, 403 as const);
    }

    const headers = ctx.req.header();
    const url = `${target}${path}?${strParams}`;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...omitHeaders(headers, ['content-length', 'x-proxy-path', 'x-proxy-target']),
                'Content-Type': 'application/json',
                Referer: target
            },
            ...(method === 'POST' ? { body: JSON.stringify(await ctx.req.json()) } : {})
        });

        if (!response.ok) {
            return ctx.json({ error: 'Failed to proxy request' }, response.status as 400 | 500);
        }

        const { status, statusText, headers: resHeaders } = response;
        return new Response(response.body, { status, statusText, headers: resHeaders });
    } catch (error) {
        logger.error(`Proxy request failed: ${error instanceof Error ? error.message : String(error)}`);
        return ctx.json({ error: 'Proxy request failed' }, 500);
    }
}

app.get('/', async (ctx) => handleProxyRequest(ctx, 'GET'));
app.post('/', async (ctx) => handleProxyRequest(ctx, 'POST'));

export default app;
