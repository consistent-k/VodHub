import type { Movie, MultiSearchResult } from 'tmdb-ts';
import { TMDB } from 'tmdb-ts';

import type { TmdbMediaItem } from '@/types/tmdb';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

let client: TMDB | null = null;

export const createTmdbClient = (token: string): TMDB => {
    client = new TMDB(token, { fetch: globalThis.fetch.bind(globalThis) });
    return client;
};

export const getTmdbClient = (): TMDB => {
    if (!client) throw new Error('TMDB client not initialized');
    return client;
};

export const resetTmdbClient = () => {
    client = null;
};

export const getPosterUrl = (path: string | null | undefined, size = 'w342'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};

export const getBackdropUrl = (path: string | null | undefined, size = 'w780'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};

export const getProfileUrl = (path: string | null | undefined, size = 'w185'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};

export const normalizeMovie = (movie: Movie): TmdbMediaItem => ({
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

interface TvLike {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    original_language: string;
}

export const normalizeTv = (tv: TvLike): TmdbMediaItem => ({
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

export const normalizeMultiSearchResult = (result: MultiSearchResult): TmdbMediaItem | null => {
    if (result.media_type === 'movie') return normalizeMovie(result);
    if (result.media_type === 'tv') return normalizeTv(result);
    return null;
};
