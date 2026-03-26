'use client';
import { App, Descriptions, Flex, Select, Typography } from 'antd';
import { includes } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

import { Loading } from '@/components/ui/Loading';
import { PalyerProps } from '@/components/video/VodPalyer';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { DetailData, VodPlayList } from '@/lib/types';
import { detailApi, playApi } from '@/services';

const { Paragraph } = Typography;

const DynamicPalyerWithNoSSR = dynamic(() => import('@/components/video/VodPalyer'), { ssr: false });

const DetailPage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id') || '';
    const site = searchParams.get('site') || '';
    const { isMobile } = useIsMobile();

    const [movieDetail, setMovieDetail] = useState<DetailData>();
    const [activePlayList, setActivePlayList] = useState<VodPlayList>();
    const [activeUrl, setActiveUrl] = useState('');

    const { message } = App.useApp();

    const [playerUrl, setPlayerUrl] = useState('');

    const playerShowType = useMemo(() => {
        let showType: PalyerProps['showType'] = 'iframe';
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
            // eslint-disable-next-line
            handleDetail(decodeURIComponent(id));
        }
    }, [id]);

    useEffect(() => {
        if (typeof site !== 'string' || !site) {
            router.push('/home');
        }
    }, [site]);

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
                    <DynamicPalyerWithNoSSR
                        url={playerUrl}
                        onError={(msg) => {
                            message.error(msg);
                        }}
                        showType={playerShowType}
                        style={{ width: '100%' }}
                    />
                </div>

                <div className={styles['vod-next-detail-playlist']} style={{ flex: 1 }}>
                    <div className={styles['vod-next-detail-header']}>
                        <span className={styles['vod-next-detail-title']}>选集播放</span>
                        <Select
                            style={{ width: 130 }}
                            options={movieDetail?.vod_play_list.map((item) => {
                                return {
                                    label: item.name,
                                    value: item.name
                                };
                            })}
                            defaultActiveFirstOption
                            variant="borderless"
                            defaultValue={activePlayList?.name}
                            onChange={(value) => {
                                const active = movieDetail?.vod_play_list.find((item) => item.name === value);
                                setActivePlayList(active);
                            }}
                        />
                    </div>

                    <div className={styles['vod-next-detail-episodes']}>
                        {activePlayList?.urls.map((item, index) => (
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

            <div className={styles['vod-next-detail-info']}>
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
            </div>
        </div>
    );
};

const SuspenseDetailPage = () => {
    return (
        <Suspense fallback={<Loading fullscreen />}>
            <DetailPage />
        </Suspense>
    );
};

export default SuspenseDetailPage;
