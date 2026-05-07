import { create } from 'zustand';

import { configApi } from '@/services';

interface AppConfigStore {
    tmdb_enabled: boolean;
    isConfigLoaded: boolean;
    fetchConfig: () => Promise<void>;
}

const useAppConfigStore = create<AppConfigStore>()((set) => ({
    tmdb_enabled: false,
    isConfigLoaded: false,
    fetchConfig: async () => {
        try {
            const res = await configApi();
            if (res.tmdb?.enabled && res.tmdb?.hasToken) {
                set({ tmdb_enabled: true, isConfigLoaded: true });
            } else {
                set({ tmdb_enabled: false, isConfigLoaded: true });
            }
        } catch (e) {
            console.error('[AppConfig] Failed to fetch config:', e);
            set({ tmdb_enabled: false, isConfigLoaded: true });
        }
    }
}));

export default useAppConfigStore;
