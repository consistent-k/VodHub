import { TMDB } from 'tmdb-ts';
import { EnvHttpProxyAgent, fetch as undiciFetch } from 'undici';

import type { TmdbCastMember, TmdbMediaItem } from './types';

import { config } from '@/config';

const LANGUAGE = 'zh-CN';

let client: TMDB | null = null;
let proxyAgent: EnvHttpProxyAgent | null = null;

const TMDB_BASE_URL = config.tmdb.baseUrl.replace(/\/+$/, '');
const getTargetUrl = (input: string | Request): string => {
    const url = typeof input === 'string' ? input : input.url;
    return url.startsWith('https://api.themoviedb.org/3') ? url.replace('https://api.themoviedb.org/3', TMDB_BASE_URL) : url;
};
const getFetch = (): typeof globalThis.fetch => {
    const hasProxy = process.env.https_proxy || process.env.http_proxy || process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

    if (!hasProxy) {
        return (input, init) => globalThis.fetch(getTargetUrl(input as string | Request), init);
    }

    if (!proxyAgent) {
        proxyAgent = new EnvHttpProxyAgent();
    }

    return (input, init) => undiciFetch(getTargetUrl(input as string | Request), { ...init, dispatcher: proxyAgent } as never);
};

export const getTmdbClient = (): TMDB => {
    if (!client) {
        client = new TMDB(config.tmdb.apiToken, { fetch: getFetch() });
    }
    return client;
};

export const normalizeMovie = (movie: {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    original_language: string;
}): TmdbMediaItem => ({
    id: movie.id,
    mediaType: 'movie',
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: movie.poster_path || null,
    backdropPath: movie.backdrop_path || null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genreIds: movie.genre_ids,
    popularity: movie.popularity,
    originalLanguage: movie.original_language
});

export const normalizeTv = (tv: {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    original_language: string;
}): TmdbMediaItem => ({
    id: tv.id,
    mediaType: 'tv',
    title: tv.name,
    originalTitle: tv.original_name,
    overview: tv.overview,
    posterPath: tv.poster_path || null,
    backdropPath: tv.backdrop_path || null,
    releaseDate: tv.first_air_date,
    voteAverage: tv.vote_average,
    voteCount: tv.vote_count,
    genreIds: tv.genre_ids,
    popularity: tv.popularity,
    originalLanguage: tv.original_language
});

export const normalizeCast = (
    cast: Array<{
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
        order: number;
    }>
): TmdbCastMember[] =>
    cast.map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path || null,
        order: c.order
    }));

export const normalizeMultiResults = (results: Array<{ media_type?: string } & Record<string, unknown>>): TmdbMediaItem[] =>
    results
        .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
        .map((r) => (r.media_type === 'movie' ? normalizeMovie(r as unknown as Parameters<typeof normalizeMovie>[0]) : normalizeTv(r as unknown as Parameters<typeof normalizeTv>[0])));

export { LANGUAGE };
