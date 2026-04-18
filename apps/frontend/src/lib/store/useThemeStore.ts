import store from 'store2';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ThemeId } from '@/lib/themes';

interface ThemeStore {
    themeId: ThemeId;
    setThemeId: (themeId: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            themeId: 'vercel' as ThemeId,
            setThemeId: (themeId: ThemeId) => set({ themeId })
        }),
        {
            name: 'vod_next_theme_storage',
            storage: {
                getItem: (name) => {
                    return store.get(name);
                },
                setItem: (name, value) => {
                    store.set(name, value);
                },
                removeItem: (name) => store.remove(name)
            }
        }
    )
);
