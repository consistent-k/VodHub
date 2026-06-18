import { App, Flex, Select, Spin } from 'antd';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { useStyles } from './styles';

import Loading from '@/components/Loading';
import type { PlayerProps } from '@/components/VodPalyer';
import useIsMobile from '@/hooks/useIsMobile';
import { playApi } from '@/services';
import type { DetailData, VodPlayList, VodPlayUrl } from '@/types';

const PlayerComponent = React.lazy(() => import('@/components/VodPalyer'));

interface PlayerWithEpisodesProps {
    detail: DetailData;
    site: string;
}

const PlayerWithEpisodes: React.FC<PlayerWithEpisodesProps> = ({ detail, site }) => {
    const { styles, cx } = useStyles();
    const { isMobile } = useIsMobile();
    const { message } = App.useApp();

    const [activePlayList, setActivePlayList] = useState<VodPlayList>(detail.vod_play_list[0]);
    const [activeUrl, setActiveUrl] = useState(detail.vod_play_list[0].urls[0].url);
    const [playerUrl, setPlayerUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [playFailed, setPlayFailed] = useState(false);

    const handlePlay = useCallback(
        async (url: string, parseUrls: string[]) => {
            setIsLoading(true);
            setPlayFailed(false);
            try {
                const res = await playApi(site, { url, parse_urls: parseUrls });
                const { data, code } = res;
                if (code === 0 && data.length > 0) {
                    setPlayerUrl(data[0].play_url);
                } else {
                    setPlayFailed(true);
                    message.error('播放失败，请尝试更换播放线路');
                }
            } catch {
                setPlayFailed(true);
            } finally {
                setIsLoading(false);
            }
        },
        [site, message]
    );

    useEffect(() => {
        if (detail?.vod_play_list?.length > 0) {
            const firstList = detail.vod_play_list[0];
            const firstUrl = firstList.urls[0]?.url || '';
            setActivePlayList(firstList);
            setActiveUrl(firstUrl);
            setPlayerUrl('');
        }
    }, [detail]);

    useEffect(() => {
        if (activeUrl && !playerUrl && !playFailed && activePlayList) {
            handlePlay(activeUrl, activePlayList.parse_urls || []);
        }
    }, [activeUrl, playerUrl, playFailed, activePlayList, handlePlay]);

    const playerShowType = useMemo((): PlayerProps['showType'] => {
        if (!playerUrl) return 'xgplayer';
        if (playerUrl.includes('m3u8')) return 'xgplayer';
        if (playerUrl.includes('mp4')) return 'xgplayer';
        return 'iframe';
    }, [playerUrl]);

    const handleEpisodeClick = useCallback((item: VodPlayUrl) => {
        setActiveUrl(item.url);
        setPlayerUrl('');
        setPlayFailed(false);
    }, []);

    return (
        <Flex vertical={isMobile} gap={24} style={{ height: '100%' }}>
            <div className={styles.player} style={{ width: isMobile ? '100%' : 'calc(100% - 400px)' }}>
                {playerUrl ? (
                    <Suspense fallback={<Loading />}>
                        <PlayerComponent url={playerUrl} onError={(msg: string) => message.error(msg)} showType={playerShowType} style={{ width: '100%' }} />
                    </Suspense>
                ) : (
                    <div className={styles.playerPlaceholder}>
                        <Spin />
                    </div>
                )}
            </div>

            <div className={styles.playlist} style={{ flex: 1 }}>
                <div className={styles.header}>
                    <span className={styles.title}>选集播放</span>
                    <Select
                        style={{ width: 130 }}
                        options={detail.vod_play_list.map((item) => ({
                            label: item.name,
                            value: item.name
                        }))}
                        defaultActiveFirstOption
                        variant="borderless"
                        value={activePlayList?.name}
                        onChange={(value) => {
                            const active = detail.vod_play_list.find((item) => item.name === value);
                            if (active) {
                                setActivePlayList(active);
                                setActiveUrl(active.urls[0].url);
                                setPlayerUrl('');
                            }
                        }}
                    />
                </div>

                <div className={styles.episodes}>
                    {isLoading && (
                        <div style={{ width: '100%', textAlign: 'center', padding: 20 }}>
                            <Spin />
                        </div>
                    )}
                    {activePlayList?.urls.map((item, index) => (
                        <div
                            key={`${item.url}-${index.toString()}`}
                            className={cx(styles.episode, activeUrl === item.url && styles.episodeActive)}
                            title={item.name}
                            onClick={() => handleEpisodeClick(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </Flex>
    );
};

export default PlayerWithEpisodes;
