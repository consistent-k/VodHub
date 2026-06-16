import React, { useCallback, useMemo } from 'react';

import { useStyles } from './styles';

import FeaturedCarousel from '@/components/FeaturedCarousel';
import Loading from '@/components/Loading';
import MediaList, { MediaListItem } from '@/components/MediaList';
import { useTmdbHome } from '@/hooks/useTmdb';
import useTmdbStore from '@/store/useTmdbStore';
import type { TmdbMediaItem } from '@/types/tmdb';
import { getPosterUrl } from '@/utils/tmdb';

const toMediaListItems = (items: TmdbMediaItem[]): MediaListItem[] =>
    items.map((item) => ({
        id: `${item.mediaType}-${item.id}`,
        title: item.title,
        posterUrl: getPosterUrl(item.posterPath),
        extra: item.releaseDate?.slice(0, 4),
        tmdbItem: item
    }));

const TmdbHomePage: React.FC = () => {
    const store = useTmdbStore();
    useTmdbHome();
    const { styles } = useStyles();

    const handleItemClick = useCallback((item: MediaListItem) => {
        const tmdbItem = (item as MediaListItem & { tmdbItem: TmdbMediaItem }).tmdbItem;
        window.open(`/detail/tmdb/${tmdbItem.id}?mediaType=${tmdbItem.mediaType}`, '_blank', 'noopener,noreferrer');
    }, []);

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
