import { Carousel, Rate, Tag } from 'antd';
import React from 'react';

import { useStyles } from './styles';

import type { TmdbMediaItem } from '@/types/tmdb';
import { getBackdropUrl } from '@/utils/tmdb';

interface FeaturedCarouselProps {
    items: TmdbMediaItem[];
    onItemClick: (item: TmdbMediaItem) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items, onItemClick }) => {
    const { styles } = useStyles();

    if (items.length === 0) return null;

    return (
        <div className={styles.carousel}>
            <Carousel autoplay autoplaySpeed={5000} dots dotPlacement="bottom" effect="fade">
                {items.slice(0, 10).map((item) => (
                    <div key={item.id} className={styles.slide} onClick={() => onItemClick(item)}>
                        <div
                            className={styles.backdrop}
                            style={{
                                backgroundImage: item.backdropPath ? `url(${getBackdropUrl(item.backdropPath, 'w1280')})` : undefined
                            }}
                        />
                        <div className={styles.overlay}>
                            <div className={styles.content}>
                                <div className={styles.meta}>
                                    <Tag color="blue">{item.mediaType === 'movie' ? '电影' : '剧集'}</Tag>
                                    {item.releaseDate && <span className={styles.year}>{item.releaseDate.slice(0, 4)}</span>}
                                </div>
                                <h2 className={styles.title}>{item.title}</h2>
                                <div className={styles.rating}>
                                    <Rate disabled allowHalf defaultValue={item.voteAverage / 2} style={{ fontSize: 14 }} />
                                    <span className={styles.score}>{item.voteAverage.toFixed(1)}</span>
                                </div>
                                {item.overview && <p className={styles.overview}>{item.overview}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default FeaturedCarousel;
