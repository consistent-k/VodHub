import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';

import proxy from './routes/proxy';
import registry from './routes/registry';

import api from '@/api';
import cache from '@/middleware/cache';
import jsonReturn from '@/middleware/jsonReturn';

const app = new Hono().basePath('/api/vodhub');

app.use('/*', cors());
app.use(trimTrailingSlash());
app.use(compress());

app.use(jsonReturn);
app.use(cache);
app.route('/', registry);

app.route('/', api);
app.route('/proxy', proxy);

export default app;
