import { create } from 'zustand';

import { configApi } from '@/services';
import { createTmdbClient, resetTmdbClient } from '@/utils/tmdb';

interface AppConfigStore {
    tmdb_enabled: boolean;
    tmdb_api_token: string;
    isConfigLoaded: boolean;
    fetchConfig: () => Promise<void>;
}

const useAppConfigStore = create<AppConfigStore>()((set) => ({
    tmdb_enabled: false,
    tmdb_api_token: '',
    isConfigLoaded: false,
    fetchConfig: async () => {
        try {
            const res = await configApi();
            if (res.tmdb?.enabled && res.tmdb?.apiToken) {
                createTmdbClient(res.tmdb.apiToken);
                set({ tmdb_enabled: true, tmdb_api_token: res.tmdb.apiToken, isConfigLoaded: true });
            } else {
                resetTmdbClient();
                set({ tmdb_enabled: false, tmdb_api_token: '', isConfigLoaded: true });
            }
        } catch (e) {
            console.error('[AppConfig] Failed to fetch config:', e);
            set({ tmdb_enabled: false, tmdb_api_token: '', isConfigLoaded: true });
        }
    }
}));

export default useAppConfigStore;
