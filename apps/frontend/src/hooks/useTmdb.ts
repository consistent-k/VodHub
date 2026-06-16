import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import { tmdbDetailApi, tmdbHomeApi, tmdbSearchApi } from '@/services';
import useAppConfigStore from '@/store/useAppConfigStore';
import useTmdbStore from '@/store/useTmdbStore';
import type { TmdbDetail, TmdbMediaItem } from '@/types/tmdb';

export const useIsTmdbView = (): boolean => {
    const location = useLocation();
    const { tmdb_enabled } = useAppConfigStore();

    return useMemo(() => {
        if (!tmdb_enabled) return false;
        if (location.pathname === '/home' || location.pathname === '/') return true;
        if (location.pathname.startsWith('/detail/tmdb/')) return true;
        return false;
    }, [tmdb_enabled, location.pathname]);
};

export const useTmdbHome = () => {
    const { tmdb_enabled } = useAppConfigStore();
    const { isLoading, error } = useTmdbStore();
    const fetchedRef = useRef(false);

    const fetch = useCallback(async () => {
        if (!tmdb_enabled) return;
        const store = useTmdbStore.getState();
        store.setLoading(true);
        store.setError(null);

        try {
            const res = await tmdbHomeApi();
            if (res.code !== 0 || !res.data) {
                throw new Error('TMDB home API returned error');
            }
            const data = res.data;
            store.setTrending(data.trending);
            store.setPopularMovies(data.popularMovies);
            store.setPopularTvShows(data.popularTvShows);
            store.setNowPlaying(data.nowPlaying);
            store.setUpcoming(data.upcoming);
            store.setTopRatedMovies(data.topRatedMovies);
            store.setTopRatedTv(data.topRatedTv);
            store.setGenres(data.movieGenres, data.tvGenres);
            store.setLoaded(true);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to fetch TMDB data';
            console.error('[useTmdbHome] Fetch failed:', e);
            store.setError(msg);
        } finally {
            store.setLoading(false);
        }
    }, [tmdb_enabled]);

    useEffect(() => {
        if (tmdb_enabled && !fetchedRef.current) {
            fetchedRef.current = true;
            fetch();
        }
        if (!tmdb_enabled) {
            fetchedRef.current = false;
        }
    }, [tmdb_enabled, fetch]);

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
            const res = await tmdbSearchApi({ query, page });

            if (requestId !== abortRef.current) return;

            if (res.code !== 0 || !res.data) {
                if (page === 1) setResults([]);
                return;
            }

            const items = res.data.results;

            if (page === 1) {
                setResults(items);
            } else {
                setResults((prev) => [...prev, ...items]);
            }
            setTotalPages(res.data.totalPages);
            setTotalResults(res.data.totalResults);
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
            const res = await tmdbDetailApi({ id, mediaType });
            if (res.code !== 0 || !res.data) {
                throw new Error('TMDB detail API returned error');
            }
            setDetail(res.data.detail);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch detail');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { detail, isLoading, error, fetchDetail, reset: () => setDetail(null) };
};
