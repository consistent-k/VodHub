import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingStore {
    site_name: string;
    current_site: string;
    updateSetting: (setting: Partial<Pick<SettingStore, 'site_name' | 'current_site'>>) => void;
}

const useSettingStore = create<SettingStore>()(
    persist(
        (set) => ({
            site_name: '',
            current_site: '',
            updateSetting: (setting) => set(setting)
        }),
        {
            name: 'vod_next_setting',
            partialize: (state) => ({
                site_name: state.site_name,
                current_site: state.current_site
            })
        }
    )
);

export default useSettingStore;
