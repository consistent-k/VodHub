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

const getVideoSourceBySite = (site: string): VideoSource | undefined => {
    const { videoSources } = useVideoSourcesStore.getState();
    if (site.startsWith('custom_')) {
        const id = site.replace('custom_', '');
        return videoSources.find((source) => source.id === id && source.type === 'custom');
    }
    // 内置视频源
    return videoSources.find((source) => source.id === site && source.type === 'builtin');
};

const getCmsUrl = (site: string): string | undefined => {
    const source = getVideoSourceBySite(site);
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

export const homeApi = (site_name: string) => {
    const cmsUrl = getCmsUrl(site_name);
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

export const homeVodApi = (site_name: string) => {
    const cmsUrl = getCmsUrl(site_name);
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

export const categoryApi = (site_name: string, data: CategoryParams) => {
    const cmsUrl = getCmsUrl(site_name);
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

export const detailApi = (site_name: string, data: { id: string | number }) => {
    const cmsUrl = getCmsUrl(site_name);
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

export const playApi = (site_name: string, data: PlayParams) => {
    const cmsUrl = getCmsUrl(site_name);
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

export const searchApi = (site_name: string, data: SearchParams) => {
    const cmsUrl = getCmsUrl(site_name);
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
