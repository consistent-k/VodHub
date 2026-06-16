export interface SourceInput {
    id: string;
    url: string;
    name: string;
}

export interface MatchRequest {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    originalTitle: string;
    year?: number;
    sources: SourceInput[];
}

export interface CmsMatchResult {
    vod_id: string | number;
    vod_name: string;
    vod_pic: string;
    site: string;
    sourceName: string;
}

export interface SourceMatchResult {
    sourceId: string;
    sourceName: string;
    results: CmsMatchResult[];
}

export interface SearcherResult {
    sourceId: string;
    sourceName: string;
    rawList: Array<{
        vod_id: number;
        vod_name: string;
        vod_pic: string;
        vod_year?: string;
    }>;
}

export interface MatchSummary {
    totalSources: number;
    matchedSources: number;
    totalResults: number;
}
