import { SelectProps } from 'antd';
import store from 'store2';
import { create } from 'zustand';

import useVideoSourcesStore from './useVideoSourcesStore';

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

            // 确保视频源已加载（处理冷启动场景）
            const videoSourcesState = useVideoSourcesStore.getState();
            if (videoSourcesState.videoSources.length === 0) {
                await videoSourcesState.fetchVideoSources();
            }

            // 从视频源store获取启用的视频源
            const refreshedState = useVideoSourcesStore.getState();
            const enabledVideoSources = refreshedState.videoSources.filter((source) => source.enabled);

            enabledVideoSources.forEach((source) => {
                if (source.type === 'builtin') {
                    newSites.push({
                        label: source.name,
                        value: source.id
                    });
                } else if (source.type === 'custom') {
                    newSites.push({
                        label: source.name,
                        value: `custom_${source.id}`
                    });
                }
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
