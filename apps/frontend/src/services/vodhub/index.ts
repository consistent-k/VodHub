import { ApiResponse } from '@vodhub/shared/types';
import type { VideoSource } from '@vodhub/shared/types/video-source';

import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import { HomeData, HomeVodData, CategoryVodData, DetailData, PlayData, SearchData } from '@/types';
import type { TmdbDetailData, TmdbHomeData, TmdbSearchData } from '@/types/tmdb';
import request from '@/utils/request';

const getVideoSourceBySite = async (site: string): Promise<VideoSource | undefined> => {
    const videoSourcesState = useVideoSourcesStore.getState();

    if (videoSourcesState.videoSources.length === 0) {
        await videoSourcesState.fetchVideoSources();
    }

    const { videoSources } = useVideoSourcesStore.getState();

    const enabledSources = videoSources.filter((source) => source.enabled);

    if (site.startsWith('custom_')) {
        const id = site.replace('custom_', '');
        return enabledSources.find((source) => source.id === id);
    }
    return enabledSources.find((source) => source.id === site);
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

export const configApi = () => {
    return request.get<{
        tmdb: {
            enabled: boolean;
            hasToken: boolean;
            apiToken: string;
        };
    }>(``, {
        customPreFix: '/api/vodhub/config'
    });
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
    return Promise.reject(new Error('CMS source not found'));
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
    return Promise.reject(new Error('CMS source not found'));
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
    return Promise.reject(new Error('CMS source not found'));
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
    return Promise.reject(new Error('CMS source not found'));
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
    return Promise.reject(new Error('CMS source not found'));
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
    return Promise.reject(new Error('CMS source not found'));
};

export const tmdbHomeApi = () => {
    return request.get<{ code: number; data: TmdbHomeData }>(`/home`, {
        customPreFix: '/api/vodhub/tmdb'
    });
};

export const tmdbSearchApi = (params: { query: string; page?: number }) => {
    return request.get<{ code: number; data: TmdbSearchData }>(`/search`, {
        customPreFix: '/api/vodhub/tmdb',
        params
    });
};

export const tmdbDetailApi = (params: { id: number; mediaType: 'movie' | 'tv' }) => {
    return request.get<{ code: number; data: TmdbDetailData }>(`/detail`, {
        customPreFix: '/api/vodhub/tmdb',
        params
    });
};
