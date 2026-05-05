import { useKeyPress } from 'ahooks';
import { Button, Flex, Input, Modal, theme } from 'antd';
import { debounce, trim } from 'lodash';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import SearchIcon from '../Icons/SearchIcon';
import Loading from '../Loading';
import MediaList, { MediaListItem } from '../MediaList';
import SearchTmdb from '../SearchTmdb';

import useIsMobile from '@/hooks/useIsMobile';
import { searchApi } from '@/services';
import useAppConfigStore from '@/store/useAppConfigStore';
import useSettingStore from '@/store/useSettingStore';
import { SearchData } from '@/types';

export interface VodSearchProps {
    style?: React.CSSProperties;
    site: string;
}

interface SearchContentProps {
    site: string;
    onCancel: () => void;
    style?: React.CSSProperties;
    onItemClick?: (item: MediaListItem) => void;
}

const SearchContent: React.FC<SearchContentProps> = (props) => {
    const { site, onCancel, style, onItemClick } = props;
    const { token } = theme.useToken();
    const [value, setValue] = useState('');
    const [dataSource, setDataSource] = useState<SearchData[]>([]);
    const [loading, setLoading] = useState(false);

    const getSearchData = debounce(async (val: string) => {
        setLoading(true);
        try {
            const res = await searchApi(site, {
                keyword: val,
                page: 1
            });
            const { code, data } = res;
            if (code === 0) {
                setDataSource(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, 800);

    return (
        <Flex
            vertical
            style={{
                ...style
            }}
        >
            <Flex
                align="center"
                justify="space-between"
                gap={10}
                style={{
                    padding: 10
                }}
            >
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    prefix={
                        <Button
                            size="small"
                            icon={
                                <SearchIcon
                                    style={{
                                        color: token.colorTextPlaceholder
                                    }}
                                />
                            }
                            type="text"
                        ></Button>
                    }
                    placeholder="请输入关键字后搜索"
                />
                <Button
                    onClick={() => {
                        if (!trim(value)) {
                            return;
                        }
                        getSearchData(value);
                    }}
                    type="primary"
                >
                    搜索
                </Button>
                <Button onClick={onCancel}>取消</Button>
            </Flex>

            <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto', padding: '0 16px 16px 16px' }}>
                {loading ? (
                    <Loading description="搜索中" />
                ) : (
                    <MediaList
                        items={dataSource.map(
                            (vod): MediaListItem => ({
                                id: vod.vod_id,
                                title: vod.vod_name,
                                posterUrl: vod.vod_pic,
                                badge: vod.vod_remarks || undefined
                            })
                        )}
                        onItemClick={onItemClick}
                    />
                )}
            </div>
        </Flex>
    );
};

const CmsVodSearch: React.FC<VodSearchProps> = (props) => {
    const { style, site } = props;

    const { token } = theme.useToken();
    const { isMobile } = useIsMobile();

    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    useKeyPress(['meta.k'], () => {
        setShowSearch(true);
    });

    useKeyPress(['ctrl.k'], () => {
        setShowSearch(true);
    });

    useKeyPress(27, () => {
        setShowSearch(false);
    });

    return (
        <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            {isMobile ? (
                <SearchIcon
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setShowSearch(true);
                    }}
                />
            ) : (
                <Input
                    onFocus={() => {
                        setShowSearch(true);
                    }}
                    prefix={
                        <Button
                            size="small"
                            icon={
                                <SearchIcon
                                    style={{
                                        color: token.colorTextPlaceholder
                                    }}
                                />
                            }
                            type="text"
                        ></Button>
                    }
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
                    placeholder="搜索"
                    style={{ ...style, width: 200 }}
                />
            )}

            {showSearch && isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        width: '100dvw',
                        height: '100dvh',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'var(--color-bg)',
                        zIndex: 1000
                    }}
                >
                    <SearchContent
                        site={site}
                        onCancel={() => {
                            setShowSearch(false);
                        }}
                        onItemClick={(media) => {
                            setShowSearch(false);
                            navigate(`/detail?id=${encodeURIComponent(String(media.id))}&site=${site}`);
                        }}
                        style={{
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    ></SearchContent>
                </div>
            )}

            {showSearch && !isMobile && (
                <Modal
                    open
                    footer={null}
                    title={null}
                    closeIcon={null}
                    mask
                    width={800}
                    styles={{
                        body: {
                            padding: 10
                        }
                    }}
                >
                    <SearchContent
                        style={{
                            height: 500
                        }}
                        site={site}
                        onCancel={() => {
                            setShowSearch(false);
                        }}
                        onItemClick={(media) => {
                            setShowSearch(false);
                            navigate(`/detail?id=${encodeURIComponent(String(media.id))}&site=${site}`);
                        }}
                    ></SearchContent>
                </Modal>
            )}
        </div>
    );
};

const VodSearch: React.FC<VodSearchProps> = (props) => {
    const { tmdb_enabled } = useAppConfigStore();
    const { tmdb_view_cms } = useSettingStore();

    if (tmdb_enabled && !tmdb_view_cms) {
        return <SearchTmdb style={props.style} />;
    }

    return <CmsVodSearch {...props} />;
};

export default VodSearch;
