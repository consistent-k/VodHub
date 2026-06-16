import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import type { CmsMatchResult, TmdbMediaItem } from '@/types/tmdb';
import request from '@/utils/request';

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

export interface SourceMatchResult {
    sourceId: string;
    sourceName: string;
    results: CmsMatchResult[];
}

export interface MatchSummary {
    totalSources: number;
    matchedSources: number;
    totalResults: number;
}

interface MatchResponse {
    code: number;
    message: string;
    data: SourceMatchResult[];
}

const getSourcesFromStore = (): SourceInput[] => {
    const store = useVideoSourcesStore.getState();
    return store.videoSources
        .filter((s) => s.enabled)
        .map((s) => ({
            id: `custom_${s.id}`,
            url: s.url,
            name: s.name
        }));
};

const buildMatchRequest = (item: TmdbMediaItem): MatchRequest => ({
    tmdbId: item.id,
    mediaType: item.mediaType,
    title: item.title,
    originalTitle: item.originalTitle,
    year: item.releaseDate ? Number(item.releaseDate.slice(0, 4)) : undefined,
    sources: getSourcesFromStore()
});

/** Batch match: wait for all sources */
export async function matchBatch(item: TmdbMediaItem): Promise<SourceMatchResult[]> {
    const body = buildMatchRequest(item);
    const res = await request.post<MatchResponse>('', {
        data: body,
        customPreFix: '/api/vodhub/match'
    });
    if (res.code === 0) {
        return res.data;
    }
    return [];
}

/** SSE stream match: call onMatch for each source result, returns abort function */
export function matchStream(
    item: TmdbMediaItem,
    callbacks: {
        onMatch: (result: SourceMatchResult) => void;
        onComplete: (summary: MatchSummary) => void;
        onError: (error: Error) => void;
    }
): () => void {
    const sources = getSourcesFromStore();
    if (sources.length === 0) {
        callbacks.onComplete({ totalSources: 0, matchedSources: 0, totalResults: 0 });
        return () => {};
    }

    const controller = new AbortController();
    const body = buildMatchRequest(item);

    fetch('/api/vodhub/match/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
    })
        .then(async (response) => {
            if (!response.ok || !response.body) {
                callbacks.onError(new Error(`HTTP ${response.status}`));
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const processLine = (line: string) => {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.sourceId !== undefined) {
                            callbacks.onMatch(parsed as SourceMatchResult);
                        } else if (parsed.totalSources !== undefined) {
                            callbacks.onComplete(parsed as MatchSummary);
                        } else if (parsed.error) {
                            callbacks.onError(new Error(parsed.error));
                        }
                    } catch {
                        // skip unparseable data
                    }
                }
            };

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        processLine(line);
                    }
                }

                if (buffer.trim()) {
                    processLine(buffer);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
                }
            }
        })
        .catch((error) => {
            if (error instanceof Error && error.name !== 'AbortError') {
                callbacks.onError(error);
            }
        });

    return () => controller.abort();
}
