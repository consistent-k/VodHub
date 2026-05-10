import { Hono } from 'hono';

import { config } from '@/config';

const app = new Hono();

app.get('/', (ctx) =>
    ctx.json({
        tmdb: {
            enabled: config.tmdb.enabled,
            hasToken: !!config.tmdb.apiToken
        }
    })
);

export default app;
