'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import store from 'store2';

import styles from './index.module.scss';

import { Loading } from '@/components/ui/Loading';
import VodList from '@/components/video/VodList';
import { CategoryVodData, HomeData } from '@/lib/types';
import { categoryApi, CategoryParams } from '@/services';

const CategoryPage = () => {
    const [categoryList, setCategoryList] = useState<CategoryVodData[]>([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const router = useRouter();

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
            router.push('/home');
        }
    }, [site]);

    useEffect(() => {
        if (typeof id === 'string' && id) {
            getCategory(id, filters);
        }
    }, [filters, id]);

    const currentData: HomeData | undefined = useMemo(() => {
        const homeData: HomeData[] = store.get('vod_next_home_data') || [];
        return homeData.find((item) => String(item.type_id) === id);
    }, [id]);

    const typeMap: any = {
        class: '分类',
        area: '地区',
        lang: '语言',
        year: '年份',
        letter: '首字母',
        order: '排序'
    };

    const handleFilterChange = (type: string, value: string) => {
        const newFilters = { ...filters } as any;
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
                            {currentData.filters.map((item) => {
                                return (
                                    <div key={item.type} className={styles['vod-next-category-filter']}>
                                        <div className={styles['vod-next-category-label']}>{typeMap[item.type]}</div>
                                        <div className={styles['vod-next-category-options']}>
                                            {item.children.map((cItem) => {
                                                return (
                                                    <div
                                                        key={cItem.label}
                                                        className={`${styles['vod-next-category-option']} ${(filters as any)?.[item.type] === cItem.value ? styles['active'] : ''}`}
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
                            router.push(`/detail?id=${encodeURIComponent(vod.vod_id as string)}&site=${site}`);
                        }}
                    ></VodList>
                </>
            )}
        </div>
    );
};

const SuspenseCategoryPage = () => {
    return (
        <Suspense fallback={<Loading fullscreen />}>
            <CategoryPage />
        </Suspense>
    );
};

export default SuspenseCategoryPage;
