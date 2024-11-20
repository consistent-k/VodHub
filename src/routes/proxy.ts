import { Hono } from 'hono';
import queryString from 'query-string';

import { omitHeaders } from '@/utils/headers';

const app = new Hono();

async function handleProxyRequest(ctx, method = 'GET') {
    const query = ctx.req.query();
    const strParams = queryString.stringify(query);
    const target = ctx.req.header('x-proxy-target') || '';
    const path = ctx.req.header('x-proxy-path');

    // 检查必要的 headers 是否存在
    if (!target) {
        return ctx.json({ error: 'header x-proxy-target is required' }, 400);
    }
    if (!path) {
        return ctx.json({ error: 'header x-proxy-path is required' }, 400);
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
            return ctx.json({ error: 'Failed to proxy request' }, response.status);
        }

        const newResponse = new Response(response.body, response);
        return newResponse;
    } catch (error) {
        console.error('Proxy request failed:', error);
        return ctx.json({ error: 'Proxy request failed' }, 500);
    }
}

app.get('/', async (ctx) => handleProxyRequest(ctx, 'GET'));
app.post('/', async (ctx) => handleProxyRequest(ctx, 'POST'));

export default app;
