import type { CreateVideoSourceInput, ImportMode, ImportVideoSourceItem, UpdateVideoSourceInput, VideoSource } from '@vodhub/shared/types/video-source';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 安全的ID生成器：支持非安全上下文（HTTP/LAN环境）
const generateId = (): string => {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch {
        // 在非安全上下文中 crypto.randomUUID 会抛出异常
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

const normalizeUrl = (url: string): string => {
    return url.trim().replace(/\/+$/, '').toLowerCase();
};

const dedupByUrl = (sources: VideoSource[]): VideoSource[] => {
    const map = new Map<string, VideoSource>();
    for (const source of sources) {
        map.set(normalizeUrl(source.url), source);
    }
    return Array.from(map.values());
};

interface VideoSourcesStore {
    videoSources: VideoSource[];
    isLoading: boolean;
    error: string | null;

    fetchVideoSources: () => Promise<void>;
    getVideoSourceById: (id: string) => VideoSource | undefined;
    addVideoSource: (input: CreateVideoSourceInput) => Promise<VideoSource>;
    updateVideoSource: (input: UpdateVideoSourceInput) => Promise<VideoSource>;
    deleteVideoSource: (id: string) => Promise<void>;
    toggleVideoSource: (id: string) => Promise<void>;
    importVideoSources: (items: ImportVideoSourceItem[], mode?: ImportMode) => { imported: number };

    clearError: () => void;
    clearVideoSources: () => void;
}

const useVideoSourcesStore = create<VideoSourcesStore>()(
    persist(
        (set, get) => ({
            videoSources: [],
            isLoading: false,
            error: null,

            fetchVideoSources: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 数据已通过 persist 中间件从 localStorage 恢复
                    // 只需更新加载状态
                    set({ isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '加载视频源列表失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            getVideoSourceById: (id) => {
                return get().videoSources.find((source) => source.id === id);
            },

            addVideoSource: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const newSource: VideoSource = {
                        id: generateId(),
                        name: input.name,
                        url: input.url,
                        description: input.description || '',
                        enabled: input.enabled ?? true,
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

            updateVideoSource: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const existingSource = get().videoSources.find((source) => source.id === input.id);
                    if (!existingSource) {
                        throw new Error('视频源未找到');
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

            deleteVideoSource: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const source = get().videoSources.find((s) => s.id === id);
                    if (!source) {
                        throw new Error('视频源未找到');
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

            toggleVideoSource: async (id) => {
                const source = get().getVideoSourceById(id);
                if (!source) {
                    throw new Error('视频源未找到');
                }
                await get().updateVideoSource({ id, enabled: !source.enabled });
            },

            importVideoSources: (items, mode = 'overwrite') => {
                const now = new Date().toISOString();

                // 将导入项转换为 VideoSource，生成新 ID
                const newSources: VideoSource[] = items.map((item) => ({
                    id: generateId(),
                    name: item.name,
                    url: item.url,
                    description: item.description || '',
                    enabled: item.enabled ?? true,
                    createdAt: now,
                    updatedAt: now
                }));

                // 按 URL 去重（保留最后一个）
                const deduped = dedupByUrl(newSources);

                set((state) => {
                    if (mode === 'overwrite') {
                        return { videoSources: deduped, isLoading: false };
                    }

                    // 合并模式：与已有源合并，同 URL 的旧源被替换
                    const merged = [...state.videoSources];
                    for (const newSource of deduped) {
                        const normalizedUrl = normalizeUrl(newSource.url);
                        const existingIndex = merged.findIndex((s) => normalizeUrl(s.url) === normalizedUrl);
                        if (existingIndex >= 0) {
                            merged[existingIndex] = newSource;
                        } else {
                            merged.push(newSource);
                        }
                    }
                    return { videoSources: merged, isLoading: false };
                });

                return { imported: deduped.length };
            },

            clearError: () => set({ error: null }),

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
