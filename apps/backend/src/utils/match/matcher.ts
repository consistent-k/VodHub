import type { CmsMatchResult, SearcherResult } from './types';

interface MatchInput {
    title: string;
    originalTitle: string;
    year?: number;
    sourceId: string;
    sourceName: string;
    sourceResult: SearcherResult;
}

const normalize = (s: string): string => s.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

const jaccard = (a: string, b: string): number => {
    const setA = new Set([...a]);
    const setB = new Set([...b]);
    const intersection = [...setA].filter((x) => setB.has(x)).length;
    const union = new Set([...setA, ...setB]).size;
    return union > 0 ? intersection / union : 0;
};

export function matchSource(input: MatchInput): { sourceId: string; sourceName: string; results: CmsMatchResult[] } {
    const titleNorm = normalize(input.title);
    const origNorm = normalize(input.originalTitle);
    const results: CmsMatchResult[] = [];

    for (const item of input.sourceResult.rawList) {
        const nameNorm = normalize(item.vod_name);
        let score = 0;

        // Level 1: exact match
        if (nameNorm === titleNorm || nameNorm === origNorm) {
            score = 100;
            // Level 2: one contains the other
        } else if (nameNorm.includes(titleNorm) || titleNorm.includes(nameNorm) || nameNorm.includes(origNorm) || origNorm.includes(nameNorm)) {
            score = 80;
            // Level 3: Jaccard similarity
        } else {
            const jScore = jaccard(nameNorm, titleNorm);
            if (jScore >= 0.7) {
                score = Math.round(jScore * 70);
            }
        }

        if (score > 0) {
            results.push({
                vod_id: item.vod_id,
                vod_name: item.vod_name,
                vod_pic: item.vod_pic,
                site: input.sourceId,
                sourceName: input.sourceName
            });
        }
    }

    return {
        sourceId: input.sourceId,
        sourceName: input.sourceName,
        results
    };
}
