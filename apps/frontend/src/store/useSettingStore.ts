import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
    vod_hub_api: string;
    site_name: string;
    current_site: string;
    tmdb_view_cms: boolean;
    updateSetting: (setting: Partial<Pick<SettingStore, 'vod_hub_api' | 'site_name' | 'current_site' | 'tmdb_view_cms'>>) => void;
}

const useSettingStore = create<SettingStore>()(
    persist(
        (set) => ({
            vod_hub_api: '',
            site_name: '',
            current_site: '',
            tmdb_view_cms: false,
            updateSetting: (setting) => set(setting)
        }),
        {
            name: 'vod_next_setting',
            partialize: (state) => ({
                vod_hub_api: state.vod_hub_api,
                site_name: state.site_name,
                current_site: state.current_site,
                tmdb_view_cms: state.tmdb_view_cms
            })
        }
    )
);

export default useSettingStore;
