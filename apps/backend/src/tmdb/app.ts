import { Hono, type Handler } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';

import { route as detailRoute } from './detail';
import { route as homeRoute } from './home';
import { route as searchRoute } from './search';

import cache from '@/middleware/cache';
import jsonReturn from '@/middleware/jsonReturn';

const tmdbApp = new Hono().basePath('/api/tmdb');

tmdbApp.use('/*', cors());
tmdbApp.use(trimTrailingSlash());
tmdbApp.use(compress());
tmdbApp.use(jsonReturn);
tmdbApp.use(cache);

const wrap = (handler: (ctx: Parameters<Handler>[0]) => unknown): Handler => {
    return async (ctx) => {
        if (!ctx.get('data')) {
            ctx.set('data', await handler(ctx));
        }
    };
};

tmdbApp.get('/home', wrap(homeRoute.handler));
tmdbApp.get('/search', wrap(searchRoute.handler));
tmdbApp.get('/detail', wrap(detailRoute.handler));

export default tmdbApp;
