import type { Context } from 'hono';

import { getTmdbClient, LANGUAGE, normalizeMovie, normalizeMultiResults, normalizeTv } from './client';
import type { TmdbHomeData } from './types';

import { SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        logger.info('TMDB Home - fetching');
        const client = getTmdbClient();

        const [trendingRes, popularMoviesRes, popularTvRes, nowPlayingRes, upcomingRes, topRatedMoviesRes, topRatedTvRes, movieGenresRes, tvGenresRes] = await Promise.all([
            client.trending.trending('all', 'day', { language: LANGUAGE }),
            client.movies.popular({ language: LANGUAGE }),
            client.tvShows.popular({ language: LANGUAGE }),
            client.movies.nowPlaying({ language: LANGUAGE }),
            client.movies.upcoming({ language: LANGUAGE }),
            client.movies.topRated({ language: LANGUAGE }),
            client.tvShows.topRated({ language: LANGUAGE }),
            client.genres.movies({ language: LANGUAGE }),
            client.genres.tvShows({ language: LANGUAGE })
        ]);

        const trending = normalizeMultiResults(trendingRes.results as unknown as Array<{ media_type?: string } & Record<string, unknown>>);

        const data: TmdbHomeData = {
            trending,
            popularMovies: popularMoviesRes.results.map(normalizeMovie),
            popularTvShows: popularTvRes.results.map(normalizeTv),
            nowPlaying: nowPlayingRes.results.map(normalizeMovie),
            upcoming: upcomingRes.results.map(normalizeMovie),
            topRatedMovies: topRatedMoviesRes.results.map(normalizeMovie),
            topRatedTv: topRatedTvRes.results.map(normalizeTv),
            movieGenres: movieGenresRes.genres,
            tvGenres: tvGenresRes.genres
        };

        return { code: SUCCESS_CODE, message: 'success', data };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`TMDB Home - error - ${error instanceof Error ? error.message : String(error)}`);
        return { code: SYSTEM_ERROR_CODE, message: 'TMDB home fetch failed', data: null };
    }
};

export const route = {
    path: '/home',
    name: 'tmdb-home',
    example: '/api/tmdb/home',
    description: 'TMDB 首页数据',
    handler
};
