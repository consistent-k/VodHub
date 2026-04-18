import { ApiResponse } from '@vodhub/shared/types';
import type { VideoSource } from '@vodhub/shared/types/video-source';

import useVideoSourcesStore from '@/lib/store/useVideoSourcesStore';
import { HomeData, HomeVodData, CategoryVodData, DetailData, PlayData, SearchData } from '@/lib/types';
import request from '@/lib/utils/request';

interface VodHubResponse<T> {
    code: number;
    data: T;
    update_time: string;
}

const getVideoSourceBySite = async (site: string): Promise<VideoSource | undefined> => {
    const videoSourcesState = useVideoSourcesStore.getState();

    // 确保视频源已加载（处理冷启动场景）
    if (videoSourcesState.videoSources.length === 0) {
        await videoSourcesState.fetchVideoSources();
    }

    const { videoSources } = useVideoSourcesStore.getState();

    // 只返回启用的视频源
    const enabledSources = videoSources.filter((source) => source.enabled);

    if (site.startsWith('custom_')) {
        const id = site.replace('custom_', '');
        return enabledSources.find((source) => source.id === id && source.type === 'custom');
    }
    // 内置视频源
    return enabledSources.find((source) => source.id === site && source.type === 'builtin');
};

const getCmsUrl = async (site: string): Promise<string | undefined> => {
    const source = await getVideoSourceBySite(site);
    return source?.url;
};

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

export const homeApi = async (site_name: string) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<HomeData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'list'
            }
        });
    }
    return request.get<VodHubResponse<HomeData[]>>(`/${site_name}/home`);
};

export const homeVodApi = async (site_name: string) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<HomeVodData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'detail'
            }
        });
    }
    return request.get<VodHubResponse<HomeVodData[]>>(`/${site_name}/homeVod`);
};

export const categoryApi = async (site_name: string, data: CategoryParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.post<ApiResponse<CategoryVodData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'category'
            },
            data: {
                id: data.id,
                page: data.page
            }
        });
    }
    return request.post<VodHubResponse<CategoryVodData[]>>(`/${site_name}/category`, {
        data
    });
};

export const detailApi = async (site_name: string, data: { id: string | number }) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.post<ApiResponse<DetailData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'detail'
            },
            data: {
                id: data.id
            }
        });
    }
    return request.post<VodHubResponse<DetailData[]>>(`/${site_name}/detail`, {
        data
    });
};

export const playApi = async (site_name: string, data: PlayParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.post<ApiResponse<PlayData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'play'
            },
            data: {
                url: data.url
            }
        });
    }
    return request.post<VodHubResponse<PlayData[]>>(`/${site_name}/play`, {
        data
    });
};

export const searchApi = async (site_name: string, data: SearchParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.post<ApiResponse<SearchData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'search'
            },
            data: {
                keyword: data.keyword
            }
        });
    }
    return request.post<VodHubResponse<SearchData[]>>(`/${site_name}/search`, {
        data
    });
};