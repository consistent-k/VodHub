import { searchApi } from '@/services';
import useTmdbMatchStore from '@/store/useTmdbMatchStore';
import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import type { CmsMatchResult, TmdbMediaItem } from '@/types/tmdb';

const searchSource = async (siteId: string, sourceName: string, item: TmdbMediaItem): Promise<CmsMatchResult | null> => {
    const res = await searchApi(siteId, { keyword: item.title, page: 1 });
    if (res.code === 0 && res.data && res.data.length > 0) {
        const exact = res.data.find((v) => v.vod_name === item.title || v.vod_name === item.originalTitle);
        const matched = exact || res.data[0];
        return {
            vod_id: matched.vod_id,
            vod_name: matched.vod_name,
            vod_pic: matched.vod_pic,
            site: siteId,
            sourceName
        };
    }
    return null;
};

/** Race all sources, return up to `limit` successful matches. */
export const matchTmdbToCmsTop = async (item: TmdbMediaItem, limit = 3): Promise<CmsMatchResult[]> => {
    const sources = useVideoSourcesStore.getState().videoSources.filter((s) => s.enabled);
    if (sources.length === 0) return [];

    const siteIds = sources.map((s) => (s.type === 'custom' ? `custom_${s.id}` : s.id));

    return new Promise((resolve) => {
        const results: CmsMatchResult[] = [];
        let resolved = false;
        let pending = sources.length;

        const maybeResolve = () => {
            if (!resolved && (results.length >= limit || pending === 0)) {
                resolved = true;
                resolve(results);
            }
        };

        siteIds.forEach((siteId, i) => {
            searchSource(siteId, sources[i].name, item)
                .then((result) => {
                    if (result && !resolved) {
                        results.push(result);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    pending--;
                    maybeResolve();
                });
        });
    });
};

/** Search all sources in parallel, return all matches. Caches results. */
export const matchTmdbToCms = async (item: TmdbMediaItem): Promise<CmsMatchResult[]> => {
    const matchStore = useTmdbMatchStore.getState();

    // Check cache first
    const cached = matchStore.getMatch(item.mediaType, item.id);
    if (cached !== undefined) {
        return cached;
    }

    // Get all enabled sources
    const sources = useVideoSourcesStore.getState().videoSources.filter((s) => s.enabled);
    if (sources.length === 0) {
        matchStore.setMatch(item.mediaType, item.id, []);
        return [];
    }

    try {
        const siteIds = sources.map((s) => (s.type === 'custom' ? `custom_${s.id}` : s.id));
        const settled = await Promise.allSettled(siteIds.map((siteId, i) => searchSource(siteId, sources[i].name, item)));

        const results: CmsMatchResult[] = [];
        for (const r of settled) {
            if (r.status === 'fulfilled' && r.value) {
                results.push(r.value);
            }
        }

        matchStore.setMatch(item.mediaType, item.id, results);
        return results;
    } catch {
        matchStore.setMatch(item.mediaType, item.id, []);
        return [];
    }
};

/** Search all sources, call `onMatch` for each result as it arrives. Caches final results. */
export const matchTmdbToCmsStream = (item: TmdbMediaItem, onMatch: (result: CmsMatchResult) => void): Promise<CmsMatchResult[]> => {
    const matchStore = useTmdbMatchStore.getState();

    const cached = matchStore.getMatch(item.mediaType, item.id);
    if (cached !== undefined) {
        cached.forEach(onMatch);
        return Promise.resolve(cached);
    }

    const sources = useVideoSourcesStore.getState().videoSources.filter((s) => s.enabled);
    if (sources.length === 0) {
        matchStore.setMatch(item.mediaType, item.id, []);
        return Promise.resolve([]);
    }

    const siteIds = sources.map((s) => (s.type === 'custom' ? `custom_${s.id}` : s.id));

    return new Promise((resolve) => {
        const allResults: CmsMatchResult[] = [];
        let pending = sources.length;

        siteIds.forEach((siteId, i) => {
            searchSource(siteId, sources[i].name, item)
                .then((result) => {
                    if (result) {
                        allResults.push(result);
                        onMatch(result);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    pending--;
                    if (pending === 0) {
                        matchStore.setMatch(item.mediaType, item.id, allResults);
                        resolve(allResults);
                    }
                });
        });
    });
};
