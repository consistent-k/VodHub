import { SelectProps } from 'antd';
import store from 'store2';
import { create } from 'zustand';

import useCmsStore from './useCmsStore';

import { namespaceApi } from '@/services';

interface VodSitesStore {
    hasError: boolean; // 是否有错误
    errorMessage?: string;
    isInitialized: boolean; // 是否初始化
    sites: SelectProps['options'];
    setSites: (sites: VodSitesStore['sites']) => void;
    getVodTypes: () => Promise<void>;
    resetError: () => void;
    clearVodTypes: () => void;
}

const CACHE_KEY = 'vod_next_sites';

export const useVodSitesStore = create<VodSitesStore>((set) => ({
    hasError: false,
    errorMessage: undefined,
    isInitialized: false,
    sites: [],
    setSites: (sites) => set({ sites }),
    resetError: () => set({ hasError: false, errorMessage: undefined }),
    clearVodTypes: () => {
        set({ sites: [], isInitialized: false, hasError: false });
    },
    getVodTypes: async () => {
        try {
            const res = await namespaceApi();
            const newSites: SelectProps['options'] = [];
            Object.keys(res).forEach((key) => {
                newSites.push({
                    label: res[key].name || '',
                    value: key
                });
            });

            // 获取启用的自定义CMS并添加到站点列表
            // 直接从 useCmsStore 获取，因为使用了 persist 中间件
            const cmsState = useCmsStore.getState();
            const enabledCms = cmsState.cmsList.filter((cms) => cms.enabled);
            enabledCms.forEach((cms) => {
                newSites.push({
                    label: cms.name,
                    value: `custom_${cms.id}`
                });
            });

            store.set(CACHE_KEY, {
                data: newSites,
                timestamp: Date.now()
            });
            set({ sites: newSites, isInitialized: true, hasError: false, errorMessage: undefined });
        } catch (error) {
            set({ isInitialized: false, hasError: true, errorMessage: error instanceof Error ? error.message : '未知错误' });
            throw error;
        }
    }
}));
