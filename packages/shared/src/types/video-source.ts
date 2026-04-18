// 视频源类型枚举
export type VideoSourceType = 'builtin' | 'custom';

// 内置视频源
export interface BuiltinVideoSource {
    id: string;
    name: string;
    url: string;
    description?: string;
    enabled: boolean;
    type: 'builtin';
    createdAt: string;
    updatedAt: string;
}

// 自定义视频源
export interface CustomVideoSource {
    id: string;
    name: string;
    url: string;
    description?: string;
    enabled: boolean;
    type: 'custom';
    createdAt: string;
    updatedAt: string;
}

// 视频源联合类型（支持类型收窄）
export type VideoSource = BuiltinVideoSource | CustomVideoSource;

export interface CreateVideoSourceInput {
    name: string;
    url: string;
    description?: string;
    enabled?: boolean;
    type?: 'custom'; // 创建时只能是自定义类型
}

export interface UpdateVideoSourceInput extends Partial<CreateVideoSourceInput> {
    id: string;
}