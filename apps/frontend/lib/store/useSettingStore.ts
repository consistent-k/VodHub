import store from 'store2';

const useSettingStore = () => {
    const setting = store.get('vod_next_setting') || {};

    const updateSetting = (setting: { vod_hub_api: string; site_name: string; current_site: string }) => {
        store.set('vod_next_setting', setting);
    };

    return {
        setting,
        current_site: setting.current_site,
        vod_hub_api: setting.vod_hub_api,
        site_name: setting.site_name,
        updateSetting
    };
};

export default useSettingStore;
