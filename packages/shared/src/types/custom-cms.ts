export interface CustomCms {
    id: string;
    name: string;
    url: string;
    description?: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomCmsInput {
    name: string;
    url: string;
    description?: string;
    enabled?: boolean;
}

export interface UpdateCustomCmsInput extends Partial<CreateCustomCmsInput> {
    id: string;
}
