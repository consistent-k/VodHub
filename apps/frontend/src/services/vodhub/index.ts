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

    if (videoSourcesState.videoSources.length === 0) {
        await videoSourcesState.fetchVideoSources();
    }

    const { videoSources } = useVideoSourcesStore.getState();

    const enabledSources = videoSources.filter((source) => source.enabled);

    if (site.startsWith('custom_')) {
        const id = site.replace('custom_', '');
        return enabledSources.find((source) => source.id === id && source.type === 'custom');
    }
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
    class?: string;
    area?: string;
    lang?: string;
    year?: string;
    order?: string;
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
                'x-proxy-action': 'home'
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
                'x-proxy-action': 'homeVod'
            }
        });
    }
    return request.get<VodHubResponse<HomeVodData[]>>(`/${site_name}/homeVod`);
};

export const categoryApi = async (site_name: string, params: CategoryParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<CategoryVodData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'category'
            },
            params
        });
    }
    return request.get<VodHubResponse<CategoryVodData[]>>(`/${site_name}/category`, {
        params
    });
};

export const detailApi = async (site_name: string, params: { id: string | number }) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<DetailData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'detail'
            },
            params
        });
    }
    return request.get<VodHubResponse<DetailData[]>>(`/${site_name}/detail`, {
        params
    });
};

export const playApi = async (site_name: string, params: PlayParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<PlayData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'play'
            },
            params
        });
    }
    return request.get<VodHubResponse<PlayData[]>>(`/${site_name}/play`, {
        params
    });
};

export const searchApi = async (site_name: string, params: SearchParams) => {
    const cmsUrl = await getCmsUrl(site_name);
    if (cmsUrl) {
        return request.get<ApiResponse<SearchData[]>>(`/proxy`, {
            headers: {
                'x-proxy-target': cmsUrl,
                'x-proxy-action': 'search'
            },
            params
        });
    }
    return request.get<VodHubResponse<SearchData[]>>(`/${site_name}/search`, {
        params
    });
};
