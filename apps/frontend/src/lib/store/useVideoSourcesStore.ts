import type { VideoSource, CreateVideoSourceInput, UpdateVideoSourceInput } from '@vodhub/shared/types/video-source';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import builtinCmsData from '@/data/builtin-cms.json';

interface VideoSourcesStore {
    // 状态
    videoSources: VideoSource[];
    isLoading: boolean;
    error: string | null;

    // 操作
    fetchVideoSources: () => Promise<void>;
    getVideoSourceById: (id: string) => VideoSource | undefined;
    addVideoSource: (input: CreateVideoSourceInput) => Promise<VideoSource>;
    updateVideoSource: (input: UpdateVideoSourceInput) => Promise<VideoSource>;
    deleteVideoSource: (id: string) => Promise<void>;
    toggleVideoSource: (id: string) => Promise<void>;

    // 工具
    clearError: () => void;
    clearVideoSources: () => void;
}

const useVideoSourcesStore = create<VideoSourcesStore>()(
    persist(
        (set, get) => ({
            // 初始状态
            videoSources: [],
            isLoading: false,
            error: null,

            // 获取所有视频源
            fetchVideoSources: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 加载内置视频源数据
                    const builtinSources = builtinCmsData as VideoSource[];

                    // 从持久化存储中恢复状态（包括自定义视频源和内置视频源的启用状态）
                    const storedSources = get().videoSources;

                    // 合并策略：
                    // 1. 对于内置视频源：使用存储中的启用状态（如果存在），否则使用JSON中的默认值
                    // 2. 对于自定义视频源：完全使用存储中的值
                    const mergedBuiltin = builtinSources.map((builtin) => {
                        const stored = storedSources.find((s) => s.id === builtin.id && s.type === 'builtin');
                        return stored ? { ...builtin, enabled: stored.enabled, updatedAt: stored.updatedAt } : builtin;
                    });

                    const customSources = storedSources.filter((s) => s.type === 'custom');

                    set({
                        videoSources: [...mergedBuiltin, ...customSources],
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '加载视频源列表失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 根据ID获取视频源
            getVideoSourceById: (id) => {
                return get().videoSources.find((source) => source.id === id);
            },

            // 添加视频源（只能是自定义类型）
            addVideoSource: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const newSource: VideoSource = {
                        id: crypto.randomUUID(),
                        name: input.name,
                        url: input.url,
                        description: input.description || '',
                        enabled: input.enabled ?? true,
                        type: 'custom',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    set((state) => ({
                        videoSources: [...state.videoSources, newSource],
                        isLoading: false
                    }));

                    return newSource;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '添加视频源失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 更新视频源
            updateVideoSource: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const existingSource = get().videoSources.find((source) => source.id === input.id);
                    if (!existingSource) {
                        throw new Error('视频源未找到');
                    }

                    // 内置视频源只能更新启用状态
                    if (existingSource.type === 'builtin' && (input.name !== undefined || input.url !== undefined || input.description !== undefined)) {
                        throw new Error('内置视频源只能更新启用状态');
                    }

                    const updatedSource: VideoSource = {
                        ...existingSource,
                        name: input.name ?? existingSource.name,
                        url: input.url ?? existingSource.url,
                        description: input.description ?? existingSource.description,
                        enabled: input.enabled ?? existingSource.enabled,
                        updatedAt: new Date().toISOString()
                    };

                    set((state) => ({
                        videoSources: state.videoSources.map((source) => (source.id === input.id ? updatedSource : source)),
                        isLoading: false
                    }));

                    return updatedSource;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '更新视频源失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 删除视频源（只能删除自定义类型）
            deleteVideoSource: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const source = get().videoSources.find((s) => s.id === id);
                    if (!source) {
                        throw new Error('视频源未找到');
                    }

                    if (source.type === 'builtin') {
                        throw new Error('内置视频源不能删除');
                    }

                    set((state) => ({
                        videoSources: state.videoSources.filter((source) => source.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '删除视频源失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 切换视频源启用状态
            toggleVideoSource: async (id) => {
                const source = get().getVideoSourceById(id);
                if (source) {
                    await get().updateVideoSource({ id, enabled: !source.enabled });
                }
            },

            // 清除错误
            clearError: () => set({ error: null }),

            // 清除视频源列表
            clearVideoSources: () => set({ videoSources: [] })
        }),
        {
            name: 'vodhub-video-sources-store',
            partialize: (state) => ({
                videoSources: state.videoSources
            })
        }
    )
);

export default useVideoSourcesStore;
