import { Carousel, Rate, Tag } from 'antd';
import React from 'react';

import styles from './index.module.scss';

import type { TmdbMediaItem } from '@/types/tmdb';
import { getBackdropUrl } from '@/utils/tmdb';

interface FeaturedCarouselProps {
    items: TmdbMediaItem[];
    onItemClick: (item: TmdbMediaItem) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items, onItemClick }) => {
    if (items.length === 0) return null;

    return (
        <div className={styles['featured-carousel']}>
            <Carousel autoplay autoplaySpeed={5000} dots dotPlacement="bottom" effect="fade">
                {items.slice(0, 10).map((item) => (
                    <div key={item.id} className={styles['featured-carousel-slide']} onClick={() => onItemClick(item)}>
                        <div
                            className={styles['featured-carousel-backdrop']}
                            style={{
                                backgroundImage: item.backdropPath ? `url(${getBackdropUrl(item.backdropPath, 'w1280')})` : undefined
                            }}
                        />
                        <div className={styles['featured-carousel-overlay']}>
                            <div className={styles['featured-carousel-content']}>
                                <div className={styles['featured-carousel-meta']}>
                                    <Tag color="blue">{item.mediaType === 'movie' ? '电影' : '剧集'}</Tag>
                                    {item.releaseDate && <span className={styles['featured-carousel-year']}>{item.releaseDate.slice(0, 4)}</span>}
                                </div>
                                <h2 className={styles['featured-carousel-title']}>{item.title}</h2>
                                <div className={styles['featured-carousel-rating']}>
                                    <Rate disabled allowHalf defaultValue={item.voteAverage / 2} style={{ fontSize: 14 }} />
                                    <span className={styles['featured-carousel-score']}>{item.voteAverage.toFixed(1)}</span>
                                </div>
                                {item.overview && <p className={styles['featured-carousel-overview']}>{item.overview}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default FeaturedCarousel;
