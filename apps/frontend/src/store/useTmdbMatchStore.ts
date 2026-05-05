import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CmsMatchResult } from '@/types/tmdb';

interface MatchCacheEntry {
    results: CmsMatchResult[];
    timestamp: number;
}

interface TmdbMatchStore {
    cache: Record<string, MatchCacheEntry>;
    getMatch: (mediaType: string, id: number) => CmsMatchResult[] | undefined;
    setMatch: (mediaType: string, id: number, results: CmsMatchResult[]) => void;
    clearExpired: () => void;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const useTmdbMatchStore = create<TmdbMatchStore>()(
    persist(
        (set, get) => ({
            cache: {},
            getMatch: (mediaType, id) => {
                const key = `tmdb:${mediaType}:${id}`;
                const entry = get().cache[key];
                if (!entry) return undefined;
                if (Date.now() - entry.timestamp > CACHE_TTL) {
                    const { [key]: _, ...rest } = get().cache;
                    set({ cache: rest });
                    return undefined;
                }
                return entry.results;
            },
            setMatch: (mediaType, id, results) => {
                const key = `tmdb:${mediaType}:${id}`;
                set({
                    cache: {
                        ...get().cache,
                        [key]: { results, timestamp: Date.now() }
                    }
                });
            },
            clearExpired: () => {
                const now = Date.now();
                const cache = get().cache;
                const valid: Record<string, MatchCacheEntry> = {};
                for (const [k, v] of Object.entries(cache)) {
                    if (now - v.timestamp <= CACHE_TTL) {
                        valid[k] = v;
                    }
                }
                set({ cache: valid });
            }
        }),
        {
            name: 'vod_next_tmdb_match'
        }
    )
);

export default useTmdbMatchStore;
