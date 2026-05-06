// 视频源
export interface VideoSource {
    id: string;
    name: string;
    url: string;
    description?: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVideoSourceInput {
    name: string;
    url: string;
    description?: string;
    enabled?: boolean;
}

export interface UpdateVideoSourceInput extends Partial<CreateVideoSourceInput> {
    id: string;
}

// 导入视频源的原始数据格式
export interface ImportVideoSourceItem {
    name: string;
    url: string;
    description?: string;
    enabled?: boolean;
}

// 导入模式
export type ImportMode = 'overwrite' | 'merge';
