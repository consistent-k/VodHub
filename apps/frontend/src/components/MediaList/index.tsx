import { Col, Image, Row } from 'antd';
import React from 'react';

import styles from './index.module.scss';

export interface MediaListItem {
    id: string | number;
    title: string;
    posterUrl: string;
    badge?: string;
    extra?: string;
}

export interface MediaListProps {
    items: MediaListItem[];
    title?: string;
    onItemClick?: (item: MediaListItem) => void;
    columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

const defaultColumns = { xs: 12, sm: 8, md: 6, lg: 4, xl: 4 };

const MediaList: React.FC<MediaListProps> = ({ items, title, onItemClick, columns = defaultColumns }) => {
    if (items.length === 0) return null;

    return (
        <div className={styles['media-list']}>
            {title && (
                <div className={styles['media-list-header']}>
                    <div className={styles['media-list-title']}>{title}</div>
                </div>
            )}
            <Row gutter={[20, 20]}>
                {items.map((item) => (
                    <Col key={item.id} xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg} xl={columns.xl}>
                        <div className={styles['media-card']} onClick={() => onItemClick?.(item)}>
                            <div className={styles['media-card-cover']}>
                                {item.badge && <div className={styles['media-card-badge']}>{item.badge}</div>}
                                <div className={styles['media-card-play']}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                    </svg>
                                </div>
                                <Image
                                    rootClassName={styles['media-card-pic']}
                                    src={item.posterUrl}
                                    alt={item.title}
                                    preview={false}
                                    style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                                />
                            </div>
                            <div className={styles['media-card-info']}>
                                <div className={styles['media-card-title']}>{item.title}</div>
                                {item.extra && <div className={styles['media-card-extra']}>{item.extra}</div>}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default MediaList;
