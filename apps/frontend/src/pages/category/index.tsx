import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import store from 'store2';

import styles from './index.module.scss';

import { Loading } from '@/components/ui/Loading';
import VodList from '@/components/video/VodList';
import { CategoryVodData, Filter, FilterItem, HomeData } from '@/lib/types';
import { categoryApi, CategoryParams } from '@/services';

const CategoryPage = () => {
    const [categoryList, setCategoryList] = useState<CategoryVodData[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const id = searchParams.get('id') || '';
    const name = searchParams.get('name') || '';
    const site = searchParams.get('site') || '';
    const [filters, setFilters] = useState<CategoryParams['filters']>();

    const getCategory = async (id: string | number, filters?: CategoryParams['filters']) => {
        setLoading(true);
        try {
            const res = await categoryApi(site, {
                id: id,
                page: 1,
                limit: 30,
                filters
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
    };

    useEffect(() => {
        if (typeof site !== 'string' || !site) {
            navigate('/home');
        }
    }, [site, navigate]);

    useEffect(() => {
        if (typeof id === 'string' && id) {
            if (site) {
                getCategory(id, filters);
            }
        }
    }, [filters, id, site]);

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
        const newFilters = { ...filters } as Record<string, string>;
        if (value === '') {
            delete newFilters[type];
        } else {
            newFilters[type] = value;
        }
        setFilters(newFilters);
    };

    return (
        <div className={styles['vod-next-category']}>
            {loading ? (
                <Loading fullscreen description="加载中" />
            ) : (
                <>
                    {currentData?.filters?.length ? (
                        <div className={styles['vod-next-category-filters']}>
                            {currentData.filters.map((item: Filter) => {
                                return (
                                    <div key={item.type} className={styles['vod-next-category-filter']}>
                                        <div className={styles['vod-next-category-label']}>{typeMap[item.type]}</div>
                                        <div className={styles['vod-next-category-options']}>
                                            {item.children.map((cItem: FilterItem) => {
                                                return (
                                                    <div
                                                        key={cItem.label}
                                                        className={`${styles['vod-next-category-option']} ${(filters as Record<string, string>)?.[item.type] === cItem.value ? styles['active'] : ''}`}
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

                    <VodList
                        dataSource={categoryList}
                        onItemClick={(vod) => {
                            navigate(`/detail?id=${encodeURIComponent(vod.vod_id as string)}&site=${site}`);
                        }}
                    ></VodList>
                </>
            )}
        </div>
    );
};

export default CategoryPage;
