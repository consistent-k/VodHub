import { createRoute, RouteHandler } from '@hono/zod-openapi';

import { namespaces } from '@/routes/registry';

const route = createRoute({
    method: 'get',
    path: '/namespace',
    tags: ['Namespace'],
    responses: {
        200: {
            description: 'List of namespaces'
        }
    }
});

const handler: RouteHandler<typeof route> = (ctx) => ctx.json(namespaces);

export { route, handler };
