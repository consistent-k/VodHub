import { OpenAPIHono } from '@hono/zod-openapi';

import { route as configRoute, handler as configHandler } from '@/api/config';
import { route, handler } from '@/api/namespace';

const app = new OpenAPIHono();

app.openapi(route, handler);
app.openapi(configRoute, configHandler);

export default app;
