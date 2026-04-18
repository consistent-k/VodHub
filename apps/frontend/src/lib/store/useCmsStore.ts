import type { CustomCms, CreateCustomCmsInput, UpdateCustomCmsInput } from '@vodhub/shared/types/custom-cms';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CmsStore {
    // 状态
    cmsList: CustomCms[];
    isLoading: boolean;
    error: string | null;

    // 操作
    fetchCmsList: () => Promise<void>;
    getCmsById: (id: string) => CustomCms | undefined;
    addCms: (input: CreateCustomCmsInput) => Promise<CustomCms>;
    updateCms: (input: UpdateCustomCmsInput) => Promise<CustomCms>;
    deleteCms: (id: string) => Promise<void>;

    // 工具
    clearError: () => void;
    clearCmsList: () => void;
}

const useCmsStore = create<CmsStore>()(
    persist(
        (set, get) => ({
            // 初始状态
            cmsList: [],
            isLoading: false,
            error: null,

            // 获取CMS列表（从本地存储加载）
            fetchCmsList: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 状态已通过persist中间件自动从localStorage恢复
                    // 这里只需要确保状态已加载
                    set({ isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '加载CMS列表失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 根据ID获取CMS
            getCmsById: (id) => {
                return get().cmsList.find((cms) => cms.id === id);
            },

            // 添加CMS
            addCms: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const newCms: CustomCms = {
                        id: crypto.randomUUID(),
                        name: input.name,
                        url: input.url,
                        description: input.description || '',
                        enabled: input.enabled ?? true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    set((state) => ({
                        cmsList: [...state.cmsList, newCms],
                        isLoading: false
                    }));

                    return newCms;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '添加CMS失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 更新CMS
            updateCms: async (input) => {
                set({ isLoading: true, error: null });
                try {
                    const existingCms = get().cmsList.find((cms) => cms.id === input.id);
                    if (!existingCms) {
                        throw new Error('CMS not found');
                    }

                    const updatedCms: CustomCms = {
                        ...existingCms,
                        name: input.name ?? existingCms.name,
                        url: input.url ?? existingCms.url,
                        description: input.description ?? existingCms.description,
                        enabled: input.enabled ?? existingCms.enabled,
                        updatedAt: new Date().toISOString()
                    };

                    set((state) => ({
                        cmsList: state.cmsList.map((cms) => (cms.id === input.id ? updatedCms : cms)),
                        isLoading: false
                    }));

                    return updatedCms;
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '更新CMS失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 删除CMS
            deleteCms: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    set((state) => ({
                        cmsList: state.cmsList.filter((cms) => cms.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : '删除CMS失败',
                        isLoading: false
                    });
                    throw error;
                }
            },

            // 清除错误
            clearError: () => set({ error: null }),

            // 清除CMS列表
            clearCmsList: () => set({ cmsList: [] })
        }),
        {
            name: 'vodhub-cms-store',
            partialize: (state) => ({
                cmsList: state.cmsList
            })
        }
    )
);

export default useCmsStore;
