import React from 'react';

import { useStyles } from './styles';

import MediaList, { type MediaListItem } from '@/components/MediaList';
import type { TmdbMediaItem } from '@/types/tmdb';
import { getPosterUrl } from '@/utils/tmdb';

interface RelatedSectionProps {
    recommendations: TmdbMediaItem[];
    similar: TmdbMediaItem[];
}

const toMediaListItems = (items: TmdbMediaItem[]): MediaListItem[] =>
    items.map((item) => ({
        id: `${item.mediaType}-${item.id}`,
        title: item.title,
        posterUrl: getPosterUrl(item.posterPath),
        extra: item.releaseDate?.slice(0, 4),
        tmdbItem: item
    }));

const RelatedSection: React.FC<RelatedSectionProps> = ({ recommendations, similar }) => {
    const { styles } = useStyles();

    const handleItemClick = (item: MediaListItem) => {
        const tmdbItem = (item as MediaListItem & { tmdbItem: TmdbMediaItem }).tmdbItem;
        window.open(`/detail/tmdb/${tmdbItem.id}?mediaType=${tmdbItem.mediaType}`, '_blank', 'noopener,noreferrer');
    };

    const hasContent = recommendations.length > 0 || similar.length > 0;
    if (!hasContent) return null;

    return (
        <>
            {recommendations.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.title}>推荐内容</div>
                    <MediaList items={toMediaListItems(recommendations)} onItemClick={handleItemClick} />
                </div>
            )}
            {similar.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.title}>相似内容</div>
                    <MediaList items={toMediaListItems(similar)} onItemClick={handleItemClick} />
                </div>
            )}
        </>
    );
};

export default RelatedSection;
