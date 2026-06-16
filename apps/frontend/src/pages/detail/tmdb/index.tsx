import { Button, Empty } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { useStyles } from './styles';

import CastSection from '@/components/detail/CastSection';
import PlayerWithEpisodes from '@/components/detail/PlayerWithEpisodes';
import RelatedSection from '@/components/detail/RelatedSection';
import SourceSelector from '@/components/detail/SourceSelector';
import TmdbHeader from '@/components/detail/TmdbHeader';
import Loading from '@/components/Loading';
import { detailApi, tmdbDetailApi } from '@/services';
import { matchStream } from '@/services/match';
import type { SourceMatchResult } from '@/services/match';
import useTmdbMatchStore from '@/store/useTmdbMatchStore';
import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import type { DetailData } from '@/types';
import type { CmsMatchResult, TmdbCastMember, TmdbDetail, TmdbDetailData, TmdbMediaItem } from '@/types/tmdb';

const TmdbDetailPage: React.FC = () => {
    const { tmdbId } = useParams<{ tmdbId: string }>();
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('mediaType') || '';
    const preSite = searchParams.get('site');
    const preVodId = searchParams.get('vodId');
    const navigate = useNavigate();
    const { styles } = useStyles();

    const [detail, setDetail] = useState<TmdbDetail | null>(null);
    const [credits, setCredits] = useState<TmdbCastMember[]>([]);
    const [recommendations, setRecommendations] = useState<TmdbMediaItem[]>([]);
    const [similar, setSimilar] = useState<TmdbMediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [matchedSources, setMatchedSources] = useState<SourceMatchResult[]>([]);
    const [isMatching, setIsMatching] = useState(false);
    const [matchingProgress, setMatchingProgress] = useState({ total: 0, matched: 0 });

    const [activeCmsDetail, setActiveCmsDetail] = useState<DetailData | null>(null);
    const [activeSite, setActiveSite] = useState<string | null>(null);
    const [isLoadingCms, setIsLoadingCms] = useState(false);

    const abortMatchRef = useRef<(() => void) | null>(null);
    const matchStore = useTmdbMatchStore();

    useEffect(() => {
        if (!tmdbId || !mediaType) {
            setLoading(false);
            setError(true);
            return;
        }
        let cancelled = false;

        const fetchTmdb = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await tmdbDetailApi({ id: Number(tmdbId), mediaType: mediaType as 'movie' | 'tv' });
                if (cancelled) return;
                if (res.code === 0 && res.data) {
                    const d: TmdbDetailData = res.data;
                    setDetail(d.detail);
                    setCredits(d.credits?.cast || []);
                    setRecommendations(d.recommendations || []);
                    setSimilar(d.similar || []);
                } else {
                    setError(true);
                }
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchTmdb();
        return () => {
            cancelled = true;
        };
    }, [tmdbId, mediaType]);

    useEffect(() => {
        if (!detail || !tmdbId || !mediaType) return;

        const cached = matchStore.getMatch(mediaType, Number(tmdbId));
        if (cached) {
            const grouped: SourceMatchResult[] = [
                {
                    sourceId: 'cached',
                    sourceName: '缓存',
                    results: cached
                }
            ];
            setMatchedSources(grouped);
            setIsMatching(false);
            return;
        }

        const item: TmdbMediaItem = {
            id: Number(tmdbId),
            mediaType: mediaType as 'movie' | 'tv',
            title: detail.title,
            originalTitle: detail.originalTitle || detail.title,
            overview: detail.overview || '',
            posterPath: detail.posterPath,
            backdropPath: detail.backdropPath,
            releaseDate: detail.releaseDate || '',
            voteAverage: detail.voteAverage || 0,
            voteCount: detail.voteCount || 0,
            genreIds: detail.genreIds || [],
            popularity: detail.popularity || 0,
            originalLanguage: detail.originalLanguage || ''
        };

        setIsMatching(true);
        const totalSources = useVideoSourcesStore.getState().videoSources.filter((s) => s.enabled).length;
        const accumulated: SourceMatchResult[] = [];

        abortMatchRef.current = matchStream(item, {
            onMatch: (sourceResult) => {
                const existing = accumulated.findIndex((s) => s.sourceId === sourceResult.sourceId);
                if (existing >= 0) {
                    accumulated[existing] = sourceResult;
                } else {
                    accumulated.push(sourceResult);
                }
                setMatchedSources([...accumulated]);
                setMatchingProgress((prev) => ({
                    total: Math.max(prev.total, totalSources),
                    matched: accumulated.length
                }));
            },
            onComplete: (_summary) => {
                setIsMatching(false);
                const allResults: CmsMatchResult[] = accumulated.flatMap((s) => s.results);
                if (allResults.length > 0) {
                    matchStore.setMatch(mediaType, Number(tmdbId), allResults);
                }
            },
            onError: () => {
                setIsMatching(false);
            }
        });

        return () => {
            abortMatchRef.current?.();
        };
    }, [detail, tmdbId, mediaType, matchStore]);

    const loadCmsSource = useCallback(async (site: string, vodId: string | number) => {
        setIsLoadingCms(true);
        try {
            const res = await detailApi(site, { id: vodId });
            if (res.code === 0 && res.data.length > 0) {
                setActiveCmsDetail(res.data[0]);
                setActiveSite(site);
            }
        } catch {
        } finally {
            setIsLoadingCms(false);
        }
    }, []);

    const handleSourceSelect = useCallback(
        (site: string, vodId: string | number) => {
            loadCmsSource(site, vodId);
        },
        [loadCmsSource]
    );

    // Pre-matched scenario: load CMS source immediately
    useEffect(() => {
        if (preSite && preVodId && detail && !activeCmsDetail) {
            loadCmsSource(preSite, decodeURIComponent(preVodId));
        }
    }, [preSite, preVodId, detail, activeCmsDetail, loadCmsSource]);

    if (loading) {
        return <Loading fullscreen />;
    }

    if (error || !detail || !mediaType) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <Empty description="加载失败">
                    <Button type="primary" onClick={() => navigate('/home')}>
                        返回首页
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                {isLoadingCms && <Loading />}

                {activeCmsDetail && activeSite && <PlayerWithEpisodes detail={activeCmsDetail} site={activeSite} />}

                <TmdbHeader detail={detail} />

                <SourceSelector sources={matchedSources} isMatching={isMatching} progress={matchingProgress} activeSourceId={activeSite} onSelect={handleSourceSelect} />

                <CastSection cast={credits} />

                <RelatedSection recommendations={recommendations} similar={similar} />
            </div>
        </div>
    );
};

export default TmdbDetailPage;
