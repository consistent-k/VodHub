import { Hono } from 'hono';
import queryString from 'query-string';

import { omitHeaders } from '@/utils/headers';

const app = new Hono();

app.get('/', async (c) => {
    const query = c.req.query();
    const strParams = queryString.stringify(query);
    const target = c.req.header('x-proxy-target') || '';
    const path = c.req.header('x-proxy-path');
    const headers = c.req.header();
    const response = await fetch(`${target}${path}?${strParams}`, {
        headers: {
            ...omitHeaders(headers, ['content-length', 'x-proxy-path', 'x-proxy-target']),
            'Content-Type': 'application/json',
            Referer: target
        }
    });
    const newResponse = new Response(response.body, response);
    return newResponse;
});

app.post('/', async (c) => {
    const body = await c.req.json();
    const target = c.req.header('x-proxy-target');
    const path = c.req.header('x-proxy-path');
    const headers = c.req.header();
    const response = await fetch(`${target}${path}`, {
        method: 'POST',
        headers: {
            ...omitHeaders(headers, ['content-length', 'x-proxy-path', 'x-proxy-target']),
            'Content-Type': 'application/json',
            Referer: target || ''
        },
        body: JSON.stringify(body)
    });
    console.log('response', response);
    const newResponse = new Response(response.body, response);
    return newResponse;
});

export default app;
