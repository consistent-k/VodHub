import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { trimTrailingSlash } from 'hono/trailing-slash';

import configRoutes from '@/api/config';
import cache from '@/middleware/cache';
import jsonReturn from '@/middleware/jsonReturn';
import aiSummaryApp from '@/modules/ai-summary/app';
import proxyRoutes from '@/modules/cms/proxy';
import matchApp from '@/modules/match/app';
import tmdbApp from '@/modules/tmdb/app';

const app = new Hono().basePath('/api/vodhub');
const cmsApp = new Hono();

app.use(logger());

cmsApp.use('/*', cors());
cmsApp.use(trimTrailingSlash());
cmsApp.use(compress());

cmsApp.use(jsonReturn);
cmsApp.use(cache);

cmsApp.route('/proxy', proxyRoutes);

app.route('/ai', aiSummaryApp);
app.route('/cms', cmsApp);
app.route('/config', configRoutes);
app.route('/match', matchApp);
app.route('/tmdb', tmdbApp);

export default app;
