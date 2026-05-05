import { App, Col, Descriptions, Flex, Image, Row, Select, Tabs, Typography } from 'antd';
import { includes } from 'lodash';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

import styles from './index.module.scss';

import Loading from '@/components/Loading';
import { PlayerProps } from '@/components/VodPalyer';
import useIsMobile from '@/hooks/useIsMobile';
import { detailApi, playApi } from '@/services';
import useTmdbDetailStore from '@/store/useTmdbDetailStore';
import { DetailData, VodPlayList, VodPlayUrl } from '@/types';
import type { CmsMatchResult, TmdbMediaItem } from '@/types/tmdb';
import { matchTmdbToCms } from '@/utils/tmdb-match';

const { Paragraph } = Typography;

const DetailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id') || '';
    const site = searchParams.get('site') || '';
    const tmdbId = searchParams.get('tmdbId');
    const mediaType = searchParams.get('mediaType');
    const { isMobile } = useIsMobile();

    const [movieDetail, setMovieDetail] = useState<DetailData>();
    const [activePlayList, setActivePlayList] = useState<VodPlayList>();
    const [activeUrl, setActiveUrl] = useState('');
    const [tmdbMatches, setTmdbMatches] = useState<CmsMatchResult[]>([]);

    const { message } = App.useApp();

    const [playerUrl, setPlayerUrl] = useState('');

    const playerShowType = useMemo(() => {
        let showType: PlayerProps['showType'] = 'iframe';
        if (includes(playerUrl, 'm3u8')) {
            showType = 'xgplayer';
        }
        if (includes(playerUrl, 'mp4')) {
            showType = 'xgplayer';
        }

        return showType;
    }, [playerUrl]);

    const handlePlay = async (url: string, parse_urls: string[]) => {
        try {
            const res = await playApi(site as string, {
                url,
                parse_urls
            });
            const { data, code } = res;
            if (code === 0 && data.length > 0) {
                setPlayerUrl(data[0].play_url);
            } else {
                message.error('播放失败, 清尝试更换播放线路');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDetail = async (id: string | number) => {
        try {
            const res = await detailApi(site as string, {
                id
            });
            const { code, data } = res;
            if (code === 0 && data.length > 0) {
                setMovieDetail(data[0]);
                setActivePlayList(data[0].vod_play_list[0]);
                setActiveUrl(data[0].vod_play_list[0].urls[0].url);
                handlePlay(data[0].vod_play_list[0].urls[0].url, data[0].vod_play_list[0].parse_urls || []);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (typeof id === 'string' && id) {
            handleDetail(decodeURIComponent(id));
        }
    }, [id, site]);

    useEffect(() => {
        if (typeof site !== 'string' || !site) {
            if (!tmdbId) {
                navigate('/home');
            }
        }
    }, [site, navigate, tmdbId]);

    const handleTmdbSourceSwitch = (result: CmsMatchResult) => {
        navigate(`/detail?id=${encodeURIComponent(String(result.vod_id))}&site=${result.site}&tmdbId=${tmdbId}&mediaType=${mediaType}`, { replace: true });
    };

    // Initialize TMDB source matches from store or re-match on refresh
    useEffect(() => {
        if (!tmdbId || !mediaType) return;

        const storeState = useTmdbDetailStore.getState();
        if (storeState.item && storeState.item.id === Number(tmdbId)) {
            setTmdbMatches(storeState.matches);
            return;
        }

        // Fallback: store is empty (e.g. page refresh), re-match using vod_name
        if (movieDetail?.vod_name) {
            const item: TmdbMediaItem = {
                id: Number(tmdbId),
                mediaType: mediaType as TmdbMediaItem['mediaType'],
                title: movieDetail.vod_name,
                originalTitle: movieDetail.vod_name,
                overview: '',
                posterPath: null,
                backdropPath: null,
                releaseDate: movieDetail.vod_year || '',
                voteAverage: 0,
                voteCount: 0,
                genreIds: [],
                popularity: 0,
                originalLanguage: ''
            };
            matchTmdbToCms(item).then((results) => {
                setTmdbMatches(results);
            });
        }
    }, [tmdbId, mediaType, movieDetail?.vod_name]);

    if (!movieDetail) {
        return <Loading fullscreen />;
    }

    const CommonDescriptions = () => {
        return (
            <>
                <Descriptions.Item label="导演">{movieDetail?.vod_director}</Descriptions.Item>
                <Descriptions.Item label="上映日期">{movieDetail?.vod_year}</Descriptions.Item>
                <Descriptions.Item label="地区">{movieDetail?.vod_area}</Descriptions.Item>
            </>
        );
    };

    return (
        <div className={styles['vod-next-detail']}>
            <Flex vertical={isMobile} gap={24}>
                <div className={styles['vod-next-detail-player']} style={{ width: isMobile ? '100%' : 'calc(100% - 400px)' }}>
                    <Suspense fallback={<Loading />}>
                        <PlayerComponent
                            url={playerUrl}
                            onError={(msg: string) => {
                                message.error(msg);
                            }}
                            showType={playerShowType}
                            style={{ width: '100%' }}
                        />
                    </Suspense>
                </div>

                <div className={styles['vod-next-detail-playlist']} style={{ flex: 1 }}>
                    <div className={styles['vod-next-detail-header']}>
                        <span className={styles['vod-next-detail-title']}>选集播放</span>
                        <Select
                            style={{ width: 130 }}
                            options={movieDetail?.vod_play_list.map((item: VodPlayList) => {
                                return {
                                    label: item.name,
                                    value: item.name
                                };
                            })}
                            defaultActiveFirstOption
                            variant="borderless"
                            value={activePlayList?.name}
                            onChange={(value) => {
                                const active = movieDetail?.vod_play_list.find((item: VodPlayList) => item.name === value);
                                setActivePlayList(active);
                            }}
                        />
                    </div>

                    <div className={styles['vod-next-detail-episodes']}>
                        {activePlayList?.urls.map((item: VodPlayUrl, index: number) => (
                            <div
                                key={`${item.url}-${index.toString()}`}
                                className={`${styles['vod-next-detail-episode']} ${activeUrl === item.url ? styles['active'] : ''}`}
                                title={item.name}
                                onClick={() => {
                                    setActiveUrl(item.url);
                                    handlePlay(item.url, activePlayList.parse_urls || []);
                                }}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </Flex>

            <div className={styles['vod-next-detail-tabs']}>
                <Tabs
                    items={[
                        ...(tmdbMatches.length > 1
                            ? [
                                  {
                                      key: 'sources',
                                      label: `播放源 (${tmdbMatches.length})`,
                                      children: (
                                          <Row gutter={[10, 10]}>
                                              {tmdbMatches.map((match) => (
                                                  <Col key={`${match.site}-${match.vod_id}`} xs={12} sm={8} md={6} lg={6} xl={4}>
                                                      <div
                                                          className={`${styles['vod-next-detail-source-card']} ${match.site === site ? styles['active'] : ''}`}
                                                          onClick={() => handleTmdbSourceSwitch(match)}
                                                      >
                                                          {match.vod_pic && (
                                                              <Image
                                                                  src={match.vod_pic}
                                                                  alt={match.vod_name}
                                                                  width={40}
                                                                  height={54}
                                                                  preview={false}
                                                                  style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                                                                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                                                              />
                                                          )}
                                                          <div className={styles['vod-next-detail-source-info']}>
                                                              <div className={styles['vod-next-detail-source-name']}>{match.sourceName}</div>
                                                              <div className={styles['vod-next-detail-source-title']}>{match.vod_name}</div>
                                                          </div>
                                                      </div>
                                                  </Col>
                                              ))}
                                          </Row>
                                      )
                                  }
                              ]
                            : []),
                        {
                            key: 'info',
                            label: '基本信息',
                            children: (
                                <Descriptions
                                    title={<div>{movieDetail?.vod_name}</div>}
                                    column={1}
                                    styles={{
                                        label: {
                                            minWidth: 80
                                        }
                                    }}
                                >
                                    <Descriptions.Item label="简介">
                                        <Paragraph ellipsis={{ rows: isMobile ? 8 : 10, expandable: false }}>{movieDetail?.vod_content.trimStart()}</Paragraph>
                                    </Descriptions.Item>
                                    {isMobile && CommonDescriptions()}
                                    <Descriptions.Item label="演员">
                                        <Paragraph ellipsis={{ rows: isMobile ? 5 : 10, expandable: false }}>{movieDetail?.vod_actor}</Paragraph>
                                    </Descriptions.Item>
                                    {!isMobile && CommonDescriptions()}
                                </Descriptions>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
};

const PlayerComponent = React.lazy(() => import('@/components/VodPalyer'));

export default DetailPage;
