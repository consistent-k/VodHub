import { create } from 'zustand';

import type { CmsMatchResult, TmdbMediaItem } from '@/types/tmdb';

interface TmdbDetailStore {
    item: TmdbMediaItem | null;
    matches: CmsMatchResult[];
    setTmdbDetail: (item: TmdbMediaItem, matches: CmsMatchResult[]) => void;
    clear: () => void;
}

const useTmdbDetailStore = create<TmdbDetailStore>()((set) => ({
    item: null,
    matches: [],
    setTmdbDetail: (item, matches) => set({ item, matches }),
    clear: () => set({ item: null, matches: [] })
}));

export default useTmdbDetailStore;
