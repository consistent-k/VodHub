import { searchApi } from '@/services';
import useTmdbMatchStore from '@/store/useTmdbMatchStore';
import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import type { CmsMatchResult, TmdbMediaItem } from '@/types/tmdb';

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
        // Search all sources in parallel
        const siteIds = sources.map((s) => (s.type === 'custom' ? `custom_${s.id}` : s.id));
        const settled = await Promise.allSettled(
            siteIds.map(async (siteId, i) => {
                const res = await searchApi(siteId, { keyword: item.title, page: 1 });
                if (res.code === 0 && res.data && res.data.length > 0) {
                    const exact = res.data.find((v) => v.vod_name === item.title || v.vod_name === item.originalTitle);
                    const matched = exact || res.data[0];
                    return {
                        vod_id: matched.vod_id,
                        vod_name: matched.vod_name,
                        vod_pic: matched.vod_pic,
                        site: siteId,
                        sourceName: sources[i].name
                    } satisfies CmsMatchResult;
                }
                return null;
            })
        );

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
