export interface VideoSource {
    id: string;
    name: string;
    url: string;
    description?: string;
    enabled: boolean;
    type: 'builtin' | 'custom';
    createdAt: string;
    updatedAt: string;
}

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
