import { matchSource } from './matcher';
import { searchSource } from './searcher';
import type { MatchRequest, SourceMatchResult, MatchSummary } from './types';

import cache from '@/utils/cache';
import logger from '@/utils/logger';

const CACHE_TTL = 24 * 60 * 60 * 1000;

const getCacheKey = (mediaType: string, tmdbId: number): string => `vod-hub:match:${mediaType}:${tmdbId}`;

async function checkCache(mediaType: string, tmdbId: number): Promise<SourceMatchResult[] | null> {
    try {
        const raw = await cache.get(getCacheKey(mediaType, tmdbId));
        if (raw) {
            return JSON.parse(raw as string) as SourceMatchResult[];
        }
    } catch {
        // cache miss or parse error, continue
    }
    return null;
}

async function setCache(mediaType: string, tmdbId: number, results: SourceMatchResult[]): Promise<void> {
    try {
        await cache.set(getCacheKey(mediaType, tmdbId), JSON.stringify(results), CACHE_TTL);
    } catch (error) {
        logger.error(`Match cache set error: ${error}`);
    }
}

function computeSummary(results: SourceMatchResult[]): MatchSummary {
    let totalResults = 0;
    let matchedSources = 0;
    for (const r of results) {
        if (r.results.length > 0) {
            matchedSources++;
            totalResults += r.results.length;
        }
    }
    return {
        totalSources: results.length,
        matchedSources,
        totalResults
    };
}

export interface MatchAllResult {
    results: SourceMatchResult[];
    summary: MatchSummary;
}

/** Batch match: wait for all sources, return everything at once */
export async function matchAll(req: MatchRequest): Promise<MatchAllResult> {
    const cached = await checkCache(req.mediaType, req.tmdbId);
    if (cached) {
        return { results: cached, summary: computeSummary(cached) };
    }

    const searchPromises = req.sources.map((s) => searchSource(s.id, s.name, s.url, req.title));

    const settled = await Promise.allSettled(searchPromises);

    const resultArray: SourceMatchResult[] = settled
        .map((r) => {
            if (r.status === 'fulfilled') {
                return matchSource({
                    title: req.title,
                    originalTitle: req.originalTitle,
                    year: req.year,
                    sourceId: r.value.sourceId,
                    sourceName: r.value.sourceName,
                    sourceResult: r.value
                });
            }
            return { sourceId: '', sourceName: '', results: [] };
        })
        .filter((r) => r.sourceId !== '');

    await setCache(req.mediaType, req.tmdbId, resultArray);
    return { results: resultArray, summary: computeSummary(resultArray) };
}

export type MatchStreamCallback = (result: SourceMatchResult) => void;

/** Streaming match: invoke callback for each source as it completes */
export async function matchStream(req: MatchRequest, onSourceResult: MatchStreamCallback): Promise<MatchAllResult> {
    const cached = await checkCache(req.mediaType, req.tmdbId);
    if (cached) {
        for (const r of cached) {
            onSourceResult(r);
        }
        return { results: cached, summary: computeSummary(cached) };
    }

    const resultArray: SourceMatchResult[] = [];
    const promises = req.sources.map(async (s) => {
        const searcherResult = await searchSource(s.id, s.name, s.url, req.title);
        const matched = matchSource({
            title: req.title,
            originalTitle: req.originalTitle,
            year: req.year,
            sourceId: s.id,
            sourceName: s.name,
            sourceResult: searcherResult
        });
        resultArray.push(matched);
        onSourceResult(matched);
    });

    await Promise.allSettled(promises);
    await setCache(req.mediaType, req.tmdbId, resultArray);
    return { results: resultArray, summary: computeSummary(resultArray) };
}
