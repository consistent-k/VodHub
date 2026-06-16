import { Image, Tag, Typography } from 'antd';
import React from 'react';

import { useStyles } from './styles';

import type { TmdbDetail } from '@/types/tmdb';
import { getPosterUrl } from '@/utils/tmdb';

const { Paragraph } = Typography;

interface TmdbHeaderProps {
    detail: TmdbDetail;
}

const TmdbHeader: React.FC<TmdbHeaderProps> = ({ detail }) => {
    const { styles } = useStyles();
    const posterUrl = getPosterUrl(detail.posterPath, 'w342');

    return (
        <div className={styles.card}>
            {posterUrl && (
                <Image
                    src={posterUrl}
                    className={styles.poster}
                    preview={false}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                />
            )}

            <div className={styles.info}>
                <div>
                    <h1 className={styles.title}>{detail.title}</h1>
                    {detail.originalTitle && detail.originalTitle !== detail.title && <div className={styles.originalTitle}>{detail.originalTitle}</div>}
                    {detail.tagline && <div className={styles.tagline}>{detail.tagline}</div>}
                </div>

                <div className={styles.metaRow}>
                    {detail.voteAverage > 0 && (
                        <div className={styles.rating}>
                            <span className={styles.ratingStar}>★</span>
                            <span>{detail.voteAverage.toFixed(1)}</span>
                        </div>
                    )}
                    {detail.releaseDate && <span>{detail.releaseDate.slice(0, 4)}</span>}
                    {detail.runtime && (
                        <span>
                            {Math.floor(detail.runtime / 60)}h {detail.runtime % 60}m
                        </span>
                    )}
                    {detail.numberOfSeasons && <span>{detail.numberOfSeasons} 季</span>}
                    {detail.status && <span>{detail.status === 'Released' ? '已上映' : detail.status}</span>}
                </div>

                <div className={styles.genres}>
                    {detail.genres.map((genre) => (
                        <Tag key={genre.id} className={styles.genreTag}>
                            {genre.name}
                        </Tag>
                    ))}
                </div>

                {detail.overview && (
                    <Paragraph className={styles.overview} ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}>
                        {detail.overview}
                    </Paragraph>
                )}
            </div>
        </div>
    );
};

export default TmdbHeader;
