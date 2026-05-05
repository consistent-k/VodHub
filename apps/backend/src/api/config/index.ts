import { createRoute, RouteHandler } from '@hono/zod-openapi';

import { config } from '@/config';

const route = createRoute({
    method: 'get',
    path: '/config',
    tags: ['Config'],
    responses: {
        200: {
            description: 'App configuration'
        }
    }
});

const handler: RouteHandler<typeof route> = (ctx) =>
    ctx.json({
        tmdb: {
            enabled: config.tmdb.enabled,
            hasToken: !!config.tmdb.apiToken,
            apiToken: config.tmdb.apiToken
        }
    });

export { route, handler };
