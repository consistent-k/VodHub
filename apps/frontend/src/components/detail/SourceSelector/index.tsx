import { Col, Image, Progress, Row } from 'antd';
import React from 'react';

import { useStyles } from './styles';

import type { SourceMatchResult } from '@/services/match';
import type { CmsMatchResult } from '@/types/tmdb';

interface SourceSelectorProps {
    sources: SourceMatchResult[];
    isMatching: boolean;
    progress: { total: number; matched: number };
    activeSourceId: string | null;
    onSelect: (site: string, vodId: string | number) => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ sources, isMatching, progress, activeSourceId, onSelect }) => {
    const { styles, cx } = useStyles();

    const allResults: CmsMatchResult[] = sources.flatMap((s) => s.results);
    const percent = progress.total > 0 ? Math.round((progress.matched / progress.total) * 100) : 0;

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <span className={styles.title}>播放源</span>
                {isMatching && (
                    <span className={styles.progress}>
                        匹配中 ({progress.matched}/{progress.total})
                    </span>
                )}
            </div>

            {isMatching && progress.total > 0 && <Progress percent={percent} size="small" showInfo={false} style={{ marginBottom: 16 }} />}

            {isMatching && allResults.length === 0 && <div className={styles.matchingNote}>正在搜索可用的播放源...</div>}

            {!isMatching && allResults.length === 0 && <div className={styles.empty}>暂无可用播放源</div>}

            {allResults.length > 0 && (
                <Row gutter={[10, 10]}>
                    {allResults.map((result) => (
                        <Col key={`${result.site}-${result.vod_id}`} xs={12} sm={8} md={6} lg={6} xl={4}>
                            <div className={cx(styles.sourceCard, result.site === activeSourceId && styles.sourceCardActive)} onClick={() => onSelect(result.site, result.vod_id)}>
                                {result.vod_pic && (
                                    <Image
                                        src={result.vod_pic}
                                        alt={result.vod_name}
                                        width={40}
                                        height={54}
                                        preview={false}
                                        style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                                    />
                                )}
                                <div className={styles.sourceInfo}>
                                    <div className={styles.sourceName}>{result.sourceName}</div>
                                    <div className={styles.sourceTitle}>{result.vod_name}</div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default SourceSelector;
