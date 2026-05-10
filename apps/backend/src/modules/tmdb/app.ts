import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';

import detailRoutes from './detail';
import homeRoutes from './home';
import searchRoutes from './search';

import cache from '@/middleware/cache';
import jsonReturn from '@/middleware/jsonReturn';

const tmdbApp = new Hono();

tmdbApp.use('/*', cors());
tmdbApp.use(trimTrailingSlash());
tmdbApp.use(compress());
tmdbApp.use(jsonReturn);
tmdbApp.use(cache);

tmdbApp.route('/home', homeRoutes);
tmdbApp.route('/search', searchRoutes);
tmdbApp.route('/detail', detailRoutes);

export default tmdbApp;
