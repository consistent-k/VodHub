import { useKeyPress } from 'ahooks';
import { Button, Flex, Image, Input, Modal, Spin, Tag, theme } from 'antd';
import { debounce, trim } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import SearchIcon from '../Icons/SearchIcon';

import styles from './index.module.scss';

import useIsMobile from '@/hooks/useIsMobile';
import { useTmdbSearch } from '@/hooks/useTmdb';
import useTmdbDetailStore from '@/store/useTmdbDetailStore';
import type { TmdbMediaItem } from '@/types/tmdb';
import { getPosterUrl } from '@/utils/tmdb';
import { matchTmdbToCms } from '@/utils/tmdb-match';

interface SearchTmdbContentProps {
    onCancel: () => void;
    style?: React.CSSProperties;
}

const SearchTmdbContent: React.FC<SearchTmdbContentProps> = ({ onCancel, style }) => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { results, isLoading, totalResults, search, reset } = useTmdbSearch();
    const [value, setValue] = useState('');
    const [matchingId, setMatchingId] = useState<number | null>(null);

    const debouncedSearch = useMemo(() => debounce((val: string) => search(val), 800), [search]);

    const handleSearch = useCallback(
        (val: string) => {
            if (!trim(val)) {
                reset();
                return;
            }
            debouncedSearch(val);
        },
        [debouncedSearch, reset]
    );

    const handleItemClick = async (item: TmdbMediaItem) => {
        setMatchingId(item.id);
        try {
            const results = await matchTmdbToCms(item);
            if (results.length === 0) {
                // no match
            } else if (results.length === 1) {
                onCancel();
                navigate(`/detail?id=${encodeURIComponent(String(results[0].vod_id))}&site=${results[0].site}`);
            } else {
                useTmdbDetailStore.getState().setTmdbDetail(item, results);
                onCancel();
                navigate(`/detail?id=${encodeURIComponent(String(results[0].vod_id))}&site=${results[0].site}&tmdbId=${item.id}&mediaType=${item.mediaType}`);
            }
        } finally {
            setMatchingId(null);
        }
    };

    return (
        <Flex vertical style={style}>
            <Flex align="center" justify="space-between" gap={10} style={{ padding: 10 }}>
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    prefix={<Button size="small" icon={<SearchIcon style={{ color: token.colorTextPlaceholder }} />} type="text" />}
                    placeholder="搜索电影、剧集..."
                    allowClear
                />
                <Button onClick={onCancel}>取消</Button>
            </Flex>

            <div className={styles['search-tmdb-results']}>
                {isLoading && results.length === 0 ? (
                    <div className={styles['search-tmdb-loading']}>
                        <Spin />
                    </div>
                ) : results.length > 0 ? (
                    <>
                        {totalResults > 0 && <div className={styles['search-tmdb-count']}>共 {totalResults} 个结果</div>}
                        <div className={styles['search-tmdb-grid']}>
                            {results.map((item) => (
                                <div key={`${item.mediaType}-${item.id}`} className={styles['search-tmdb-item']} onClick={() => handleItemClick(item)}>
                                    <div className={styles['search-tmdb-item-cover']}>
                                        <Tag className={styles['search-tmdb-item-type']}>{item.mediaType === 'movie' ? '电影' : '剧集'}</Tag>
                                        <div className={styles['search-tmdb-item-score']}>{item.voteAverage.toFixed(1)}</div>
                                        {matchingId === item.id && (
                                            <div className={styles['search-tmdb-item-matching']}>
                                                <Spin size="small" />
                                            </div>
                                        )}
                                        <Image
                                            rootClassName={styles['search-tmdb-item-pic']}
                                            src={getPosterUrl(item.posterPath, 'w342')}
                                            alt={item.title}
                                            preview={false}
                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                                        />
                                    </div>
                                    <div className={styles['search-tmdb-item-info']}>
                                        <div className={styles['search-tmdb-item-title']}>{item.title}</div>
                                        <div className={styles['search-tmdb-item-meta']}>{item.releaseDate && <span>{item.releaseDate.slice(0, 4)}</span>}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : value.trim() ? (
                    <div className={styles['search-tmdb-empty']}>暂无搜索结果</div>
                ) : (
                    <div className={styles['search-tmdb-empty']}>输入关键字搜索电影和剧集</div>
                )}
            </div>
        </Flex>
    );
};

const SearchTmdb: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const { token } = theme.useToken();
    const { isMobile } = useIsMobile();
    const [showSearch, setShowSearch] = useState(false);

    useKeyPress(['meta.k'], () => setShowSearch(true));
    useKeyPress(['ctrl.k'], () => setShowSearch(true));
    useKeyPress(27, () => setShowSearch(false));

    return (
        <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            {isMobile ? (
                <SearchIcon style={{ cursor: 'pointer' }} onClick={() => setShowSearch(true)} />
            ) : (
                <Input
                    onFocus={() => setShowSearch(true)}
                    prefix={<Button size="small" icon={<SearchIcon style={{ color: token.colorTextPlaceholder }} />} type="text" />}
                    suffix={
                        <Flex
                            style={{
                                color: token.colorTextPlaceholder,
                                border: `1px solid ${token.colorBorder}`,
                                padding: '0 4px',
                                fontSize: 12,
                                borderRadius: 4
                            }}
                            gap={2}
                        >
                            <div>⌘</div>
                            <div>K</div>
                        </Flex>
                    }
                    placeholder="搜索电影、剧集"
                    style={{ ...style, width: 200 }}
                    readOnly
                />
            )}

            {showSearch && isMobile && (
                <div className={styles['search-tmdb-mobile-overlay']}>
                    <SearchTmdbContent onCancel={() => setShowSearch(false)} style={{ height: '100%', overflowY: 'auto' }} />
                </div>
            )}

            {showSearch && !isMobile && (
                <Modal open footer={null} title={null} closeIcon={null} mask width={800} styles={{ body: { padding: 10 } }}>
                    <SearchTmdbContent style={{ height: 500 }} onCancel={() => setShowSearch(false)} />
                </Modal>
            )}
        </div>
    );
};

export default SearchTmdb;
