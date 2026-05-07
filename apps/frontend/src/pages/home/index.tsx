import { message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { useStyles } from './styles';

import FeaturedCarousel from '@/components/FeaturedCarousel';
import Loading from '@/components/Loading';
import MediaList, { MediaListItem } from '@/components/MediaList';
import { useTmdbHome } from '@/hooks/useTmdb';
import useTmdbDetailStore from '@/store/useTmdbDetailStore';
import useTmdbStore from '@/store/useTmdbStore';
import type { TmdbMediaItem } from '@/types/tmdb';
import { getPosterUrl } from '@/utils/tmdb';
import { matchTmdbToCmsTop } from '@/utils/tmdb-match';

const toMediaListItems = (items: TmdbMediaItem[]): MediaListItem[] =>
    items.map((item) => ({
        id: `${item.mediaType}-${item.id}`,
        title: item.title,
        posterUrl: getPosterUrl(item.posterPath),
        extra: item.releaseDate?.slice(0, 4),
        tmdbItem: item
    }));

const TmdbHomePage: React.FC = () => {
    const navigate = useNavigate();
    const store = useTmdbStore();
    useTmdbHome();
    const [matching, setMatching] = useState(false);
    const { styles } = useStyles();

    const handleItemClick = useCallback(
        async (item: MediaListItem) => {
            const tmdbItem = (item as MediaListItem & { tmdbItem: TmdbMediaItem }).tmdbItem;
            setMatching(true);
            try {
                const matches = await matchTmdbToCmsTop(tmdbItem);
                if (matches.length === 0) {
                    message.info('未找到匹配的播放源');
                } else {
                    useTmdbDetailStore.getState().setTmdbDetail(tmdbItem, matches);
                    navigate(`/detail?id=${encodeURIComponent(String(matches[0].vod_id))}&site=${matches[0].site}&tmdbId=${tmdbItem.id}&mediaType=${tmdbItem.mediaType}`);
                }
            } catch {
                message.error('匹配播放源失败');
            } finally {
                setMatching(false);
            }
        },
        [navigate]
    );

    const sections = useMemo(
        () => [
            { title: '热门电影', items: store.popularMovies },
            { title: '热门剧集', items: store.popularTvShows },
            { title: '正在上映', items: store.nowPlaying },
            { title: '即将上映', items: store.upcoming },
            { title: '高分电影', items: store.topRatedMovies },
            { title: '高分剧集', items: store.topRatedTv }
        ],
        [store.popularMovies, store.popularTvShows, store.nowPlaying, store.upcoming, store.topRatedMovies, store.topRatedTv]
    );

    if (store.isLoading) {
        return <Loading fullscreen description="加载 TMDB 数据中" />;
    }

    if (store.error) {
        return (
            <div className={styles.empty}>
                <p>加载失败: {store.error}</p>
            </div>
        );
    }

    if (store.isLoaded && store.trending.length === 0 && store.popularMovies.length === 0 && store.popularTvShows.length === 0) {
        return (
            <div className={styles.empty}>
                <p>TMDB 数据为空，请检查网络连接或 API Token 配置</p>
            </div>
        );
    }

    return (
        <div className={styles.home}>
            {matching && <Loading fullscreen description="正在匹配播放源" />}
            <FeaturedCarousel
                items={store.trending}
                onItemClick={(item) =>
                    handleItemClick({
                        id: `${item.mediaType}-${item.id}`,
                        title: item.title,
                        posterUrl: getPosterUrl(item.posterPath),
                        extra: item.releaseDate?.slice(0, 4),
                        tmdbItem: item
                    } as MediaListItem & { tmdbItem: TmdbMediaItem })
                }
            />
            {sections.map((s) => (
                <MediaList key={s.title} title={s.title} items={toMediaListItems(s.items)} onItemClick={handleItemClick} />
            ))}
        </div>
    );
};

export default TmdbHomePage;
