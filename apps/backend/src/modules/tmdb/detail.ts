import { Hono } from 'hono';
import type { Context } from 'hono';

import { getTmdbClient, LANGUAGE, normalizeCast, normalizeMovie, normalizeTv } from './client';
import type { TmdbDetail, TmdbDetailData } from './types';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import logger from '@/utils/logger';

const app = new Hono();

const handler = async (ctx: Context) => {
    try {
        const { id, mediaType } = ctx.req.query();

        if (!id || !mediaType) {
            return { code: ERROR_CODE, message: 'id and mediaType parameters are required', data: null };
        }

        if (mediaType !== 'movie' && mediaType !== 'tv') {
            return { code: ERROR_CODE, message: 'mediaType must be "movie" or "tv"', data: null };
        }

        logger.info(`TMDB Detail - id: ${id}, type: ${mediaType}`);
        const client = getTmdbClient();
        const numId = Number(id);

        let detail: TmdbDetail;
        let cast: ReturnType<typeof normalizeCast>;
        let recommendations: ReturnType<typeof normalizeMovie>[];
        let similar: ReturnType<typeof normalizeMovie>[];

        if (mediaType === 'movie') {
            const res = await client.movies.details(numId, ['credits', 'recommendations', 'similar'], LANGUAGE);
            detail = {
                id: res.id,
                mediaType: 'movie',
                title: res.title,
                originalTitle: res.original_title,
                overview: res.overview,
                posterPath: res.poster_path || null,
                backdropPath: res.backdrop_path || null,
                releaseDate: res.release_date,
                voteAverage: res.vote_average,
                voteCount: res.vote_count,
                genreIds: res.genres.map((g: { id: number }) => g.id),
                genres: res.genres,
                popularity: res.popularity,
                originalLanguage: res.original_language,
                runtime: res.runtime,
                status: res.status,
                tagline: res.tagline,
                homepage: res.homepage
            };
            cast = normalizeCast(res.credits.cast);
            recommendations = res.recommendations.results.map(normalizeMovie);
            similar = res.similar.results.map(normalizeMovie);
        } else {
            const res = await client.tvShows.details(numId, ['credits', 'recommendations', 'similar'], LANGUAGE);
            detail = {
                id: res.id,
                mediaType: 'tv',
                title: res.name,
                originalTitle: res.original_name,
                overview: res.overview,
                posterPath: res.poster_path || null,
                backdropPath: res.backdrop_path || null,
                releaseDate: res.first_air_date,
                voteAverage: res.vote_average,
                voteCount: res.vote_count,
                genreIds: res.genres.map((g: { id: number }) => g.id),
                genres: res.genres,
                popularity: res.popularity,
                originalLanguage: res.original_language,
                episodeRunTime: res.episode_run_time,
                numberOfSeasons: res.number_of_seasons,
                numberOfEpisodes: res.number_of_episodes,
                status: res.status,
                tagline: res.tagline,
                homepage: res.homepage
            };
            cast = normalizeCast(res.credits.cast);
            recommendations = res.recommendations.results.map(normalizeTv);
            similar = res.similar.results.map(normalizeTv);
        }

        const data: TmdbDetailData = {
            detail,
            credits: { cast },
            recommendations,
            similar
        };

        return { code: SUCCESS_CODE, message: 'success', data };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`TMDB Detail - error - ${error instanceof Error ? error.message : String(error)}`);
        return { code: SYSTEM_ERROR_CODE, message: 'TMDB detail fetch failed', data: null };
    }
};

app.get('/', async (ctx) => ctx.json(await handler(ctx)));

export default app;
