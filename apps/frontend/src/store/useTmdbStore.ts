import { create } from 'zustand';

import type { TmdbGenre, TmdbMediaItem } from '@/types/tmdb';

interface TmdbStore {
    trending: TmdbMediaItem[];
    popularMovies: TmdbMediaItem[];
    popularTvShows: TmdbMediaItem[];
    nowPlaying: TmdbMediaItem[];
    upcoming: TmdbMediaItem[];
    topRatedMovies: TmdbMediaItem[];
    topRatedTv: TmdbMediaItem[];
    movieGenres: TmdbGenre[];
    tvGenres: TmdbGenre[];
    isLoading: boolean;
    isLoaded: boolean;
    error: string | null;

    setTrending: (data: TmdbMediaItem[]) => void;
    setPopularMovies: (data: TmdbMediaItem[]) => void;
    setPopularTvShows: (data: TmdbMediaItem[]) => void;
    setNowPlaying: (data: TmdbMediaItem[]) => void;
    setUpcoming: (data: TmdbMediaItem[]) => void;
    setTopRatedMovies: (data: TmdbMediaItem[]) => void;
    setTopRatedTv: (data: TmdbMediaItem[]) => void;
    setGenres: (movie: TmdbGenre[], tv: TmdbGenre[]) => void;
    setLoading: (loading: boolean) => void;
    setLoaded: (loaded: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    trending: [],
    popularMovies: [],
    popularTvShows: [],
    nowPlaying: [],
    upcoming: [],
    topRatedMovies: [],
    topRatedTv: [],
    movieGenres: [],
    tvGenres: [],
    isLoading: false,
    isLoaded: false,
    error: null
};

const useTmdbStore = create<TmdbStore>()((set) => ({
    ...initialState,
    setTrending: (data) => set({ trending: data }),
    setPopularMovies: (data) => set({ popularMovies: data }),
    setPopularTvShows: (data) => set({ popularTvShows: data }),
    setNowPlaying: (data) => set({ nowPlaying: data }),
    setUpcoming: (data) => set({ upcoming: data }),
    setTopRatedMovies: (data) => set({ topRatedMovies: data }),
    setTopRatedTv: (data) => set({ topRatedTv: data }),
    setGenres: (movie, tv) => set({ movieGenres: movie, tvGenres: tv }),
    setLoading: (loading) => set({ isLoading: loading }),
    setLoaded: (loaded) => set({ isLoaded: loaded }),
    setError: (error) => set({ error }),
    reset: () => set(initialState)
}));

export default useTmdbStore;
