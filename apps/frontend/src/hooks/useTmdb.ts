import { useCallback, useEffect, useRef, useState } from 'react';

import useAppConfigStore from '@/store/useAppConfigStore';
import useTmdbStore from '@/store/useTmdbStore';
import type { TmdbDetail, TmdbGenre, TmdbMediaItem } from '@/types/tmdb';
import { getTmdbClient, normalizeMovie, normalizeTv } from '@/utils/tmdb';

const LANGUAGE = 'zh-CN';

export const useTmdbHome = () => {
    const { tmdb_api_token, tmdb_enabled } = useAppConfigStore();
    const { isLoading, error } = useTmdbStore();
    const fetchedRef = useRef(false);

    const fetch = useCallback(async () => {
        if (!tmdb_api_token || !tmdb_enabled) return;
        const store = useTmdbStore.getState();
        store.setLoading(true);
        store.setError(null);

        try {
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

            const trending = trendingRes.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv').map((r) => (r.media_type === 'movie' ? normalizeMovie(r) : normalizeTv(r)));

            store.setTrending(trending);
            store.setPopularMovies(popularMoviesRes.results.map(normalizeMovie));
            store.setPopularTvShows(popularTvRes.results.map(normalizeTv));
            store.setNowPlaying(nowPlayingRes.results.map(normalizeMovie));
            store.setUpcoming(upcomingRes.results.map(normalizeMovie));
            store.setTopRatedMovies(topRatedMoviesRes.results.map(normalizeMovie));
            store.setTopRatedTv(topRatedTvRes.results.map(normalizeTv));
            store.setGenres(movieGenresRes.genres as TmdbGenre[], tvGenresRes.genres as TmdbGenre[]);
            store.setLoaded(true);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to fetch TMDB data';
            console.error('[useTmdbHome] Fetch failed:', e);
            store.setError(msg);
        } finally {
            store.setLoading(false);
        }
    }, [tmdb_api_token, tmdb_enabled]);

    useEffect(() => {
        if (tmdb_enabled && tmdb_api_token && !fetchedRef.current) {
            fetchedRef.current = true;
            fetch();
        }
        if (!tmdb_enabled) {
            fetchedRef.current = false;
        }
    }, [tmdb_enabled, tmdb_api_token, fetch]);

    return { isLoading, error, refetch: fetch };
};

export const useTmdbSearch = () => {
    const [results, setResults] = useState<TmdbMediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const abortRef = useRef(0);

    const search = useCallback(async (query: string, page = 1) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const requestId = ++abortRef.current;
        setIsLoading(true);

        try {
            const client = getTmdbClient();
            const res = await client.search.multi({ query, page, language: LANGUAGE });

            if (requestId !== abortRef.current) return;

            const items = res.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv').map((r) => (r.media_type === 'movie' ? normalizeMovie(r) : normalizeTv(r)));

            if (page === 1) {
                setResults(items);
            } else {
                setResults((prev) => [...prev, ...items]);
            }
            setTotalPages(res.total_pages);
            setTotalResults(res.total_results);
        } catch {
            if (requestId !== abortRef.current) return;
            if (page === 1) setResults([]);
        } finally {
            if (requestId === abortRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    const reset = useCallback(() => {
        abortRef.current++;
        setResults([]);
        setTotalPages(0);
        setTotalResults(0);
        setIsLoading(false);
    }, []);

    return { results, isLoading, totalPages, totalResults, search, reset };
};

export const useTmdbDetail = () => {
    const [detail, setDetail] = useState<TmdbDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async (id: number, mediaType: 'movie' | 'tv') => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getTmdbClient();
            let raw: TmdbDetail;

            if (mediaType === 'movie') {
                const res = await client.movies.details(id, ['credits', 'recommendations', 'similar'], LANGUAGE);
                raw = {
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
                    genreIds: res.genres.map((g) => g.id),
                    genres: res.genres,
                    popularity: res.popularity,
                    originalLanguage: res.original_language,
                    runtime: res.runtime,
                    status: res.status,
                    tagline: res.tagline,
                    homepage: res.homepage
                };
            } else {
                const res = await client.tvShows.details(id, ['credits', 'recommendations', 'similar'], LANGUAGE);
                raw = {
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
                    genreIds: res.genres.map((g) => g.id),
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
            }

            setDetail(raw);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch detail');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { detail, isLoading, error, fetchDetail, reset: () => setDetail(null) };
};
