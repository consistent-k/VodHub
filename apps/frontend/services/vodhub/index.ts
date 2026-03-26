import { HomeData, HomeVodData, CategoryVodData, DetailData, PlayData, SearchData } from '@/lib/types';
import request from '@/lib/utils/request';

interface VodHubResponse<T> {
    code: number;
    data: T;
    update_time: string;
}

// 定义接口类型
export interface CategoryParams {
    id: string | number;
    page: number;
    limit: number;
    filters?: {
        area?: string;
        lang?: string;
        year?: string;
    };
}

interface PlayParams {
    url: string;
    parse_urls: string[];
}

interface SearchParams {
    keyword: string;
    page: number;
}

// 获取namespace
export const namespaceApi = () => {
    return request.get<
        Record<
            string,
            {
                name: string;
                description: string;
            }
        >
    >(`/namespace`);
};

// 获取首页分类
export const homeApi = (site_name: string) => {
    return request.get<VodHubResponse<HomeData[]>>(`/${site_name}/home`);
};

// 最近更新
export const homeVodApi = (site_name: string) => {
    return request.get<VodHubResponse<HomeVodData[]>>(`/${site_name}/homeVod`);
};

// 按分类查询
export const categoryApi = (site_name: string, data: CategoryParams) => {
    return request.post<VodHubResponse<CategoryVodData[]>>(`/${site_name}/category`, {
        data
    });
};

// 详情
export const detailApi = (site_name: string, data: { id: string | number }) => {
    return request.post<VodHubResponse<DetailData[]>>(`/${site_name}/detail`, {
        data
    });
};

// 获取播放地址
export const playApi = (site_name: string, data: PlayParams) => {
    return request.post<VodHubResponse<PlayData[]>>(`/${site_name}/play`, {
        data
    });
};

// 搜索
export const searchApi = (site_name: string, data: SearchParams) => {
    return request.post<VodHubResponse<SearchData[]>>(`/${site_name}/search`, {
        data
    });
};
