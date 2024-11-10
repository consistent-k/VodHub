import { OpenAPIHono } from '@hono/zod-openapi';

import { route, handler } from '@/api/namespace';

const app = new OpenAPIHono();

app.openapi(route, handler);

export default app;
