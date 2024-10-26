import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { trimTrailingSlash } from 'hono/trailing-slash';

import registry from './registry';

import cache from '@/middleware/cache';
import jsonReturn from '@/middleware/jsonReturn';
import logger from '@/utils/logger';

process.on('uncaughtException', (e) => {
    logger.error('uncaughtException: ' + e);
});

const app = new Hono();

app.use(trimTrailingSlash());
app.use(compress());

app.use(jsonReturn);
app.use(cache);

app.route('/', registry);

export default app;
