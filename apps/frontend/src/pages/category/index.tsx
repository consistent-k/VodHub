import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import store from 'store2';

import { useStyles } from './styles';

import Loading from '@/components/Loading';
import MediaList, { MediaListItem } from '@/components/MediaList';
import { categoryApi } from '@/services';
import { CategoryVodData, Filter, FilterItem, HomeData } from '@/types';

const CategoryPage = () => {
    const [categoryList, setCategoryList] = useState<CategoryVodData[]>([]);
    const [loading, setLoading] = useState(true);
    const { styles, cx } = useStyles();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get('id') || '';
    const name = searchParams.get('name') || '';
    const site = searchParams.get('site') || '';
    const [filters, setFilters] = useState<Record<string, string>>({});

    const getCategory = useCallback(
        async (id: string | number) => {
            setLoading(true);
            try {
                const res = await categoryApi(site, {
                    id: id,
                    page: 1,
                    limit: 30,
                    ...filters
                });
                const { code, data } = res;
                if (code === 0) {
                    setCategoryList(
                        data.map((item) => {
                            return {
                                ...item,
                                type_name: name,
                                type_id: id
                            };
                        })
                    );
                } else {
                    setCategoryList([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
        [site, filters, name]
    );

    useEffect(() => {
        if (typeof site !== 'string' || !site) {
            navigate('/home');
        }
    }, [site, navigate]);

    useEffect(() => {
        if (typeof id === 'string' && id) {
            if (site) {
                getCategory(id);
            }
        }
    }, [filters, id, site, getCategory]);

    const currentData: HomeData | undefined = useMemo(() => {
        const homeData: HomeData[] = store.get('vod_next_home_data') || [];
        return homeData.find((item) => String(item.type_id) === id);
    }, [id]);

    const typeMap: Record<string, string> = {
        class: '分类',
        area: '地区',
        lang: '语言',
        year: '年份',
        letter: '首字母',
        order: '排序'
    };

    const handleFilterChange = (type: string, value: string) => {
        setFilters((prev) => {
            if (value === '') {
                const { [type]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [type]: value };
        });
    };

    return (
        <div className={styles.category}>
            {loading ? (
                <Loading fullscreen description="加载中" />
            ) : (
                <>
                    {currentData?.filters?.length ? (
                        <div className={styles.filters}>
                            {currentData.filters.map((item: Filter) => {
                                return (
                                    <div key={item.type} className={styles.filter}>
                                        <div className={styles.label}>{typeMap[item.type]}</div>
                                        <div className={styles.options}>
                                            {item.children.map((cItem: FilterItem) => {
                                                const currentValue = filters[item.type] || '';
                                                return (
                                                    <div
                                                        key={cItem.label}
                                                        className={cx(styles.option, currentValue === cItem.value && styles.active)}
                                                        onClick={() => {
                                                            handleFilterChange(item.type, cItem.label === '全部' ? '' : cItem.value);
                                                        }}
                                                    >
                                                        {cItem.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    <MediaList
                        items={categoryList.map(
                            (vod): MediaListItem => ({
                                id: vod.vod_id,
                                title: vod.vod_name,
                                posterUrl: vod.vod_pic,
                                badge: vod.vod_remarks || undefined
                            })
                        )}
                        onItemClick={(media) => {
                            window.open(`/detail/cms/${encodeURIComponent(String(media.id))}?site=${site}`, '_blank', 'noopener,noreferrer');
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default CategoryPage;
