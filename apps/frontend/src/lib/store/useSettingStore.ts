import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
    vod_hub_api: string;
    site_name: string;
    current_site: string;
    updateSetting: (setting: { vod_hub_api: string; site_name: string; current_site: string }) => void;
}

const useSettingStore = create<SettingStore>()(
    persist(
        (set) => ({
            vod_hub_api: '',
            site_name: '',
            current_site: '',
            updateSetting: (setting) => set(setting)
        }),
        {
            name: 'vod_next_setting',
            partialize: (state) => ({
                vod_hub_api: state.vod_hub_api,
                site_name: state.site_name,
                current_site: state.current_site
            })
        }
    )
);

export default useSettingStore;
