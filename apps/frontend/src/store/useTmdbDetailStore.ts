import { create } from 'zustand';

import type { TmdbMediaItem } from '@/types/tmdb';

interface TmdbDetailStore {
    item: TmdbMediaItem | null;
    setTmdbDetail: (item: TmdbMediaItem) => void;
    clear: () => void;
}

const useTmdbDetailStore = create<TmdbDetailStore>()((set) => ({
    item: null,
    setTmdbDetail: (item) => set({ item }),
    clear: () => set({ item: null })
}));

export default useTmdbDetailStore;
