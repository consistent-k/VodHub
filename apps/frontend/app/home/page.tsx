'use client';
import { uniq } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import styles from './index.module.scss';

import { Loading } from '@/components/ui/Loading';
import VodList from '@/components/video/VodList';
import useSettingStore from '@/lib/store/useSettingStore';
import { HomeVodData } from '@/lib/types';
import { homeVodApi } from '@/services';

const HomePage: React.FC = () => {
    const [homeVodData, setHomeVodData] = useState<HomeVodData[]>([]);
    const [homeVodTypes, setHomeVodTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { current_site } = useSettingStore();

    const router = useRouter();

    const getHomeVod = useCallback(async (site: string) => {
        try {
            const res = await homeVodApi(site);
            const { code, data } = res;
            if (code === 0) {
                setHomeVodData(data);
                setHomeVodTypes(uniq(data.map((item) => item.type_name)));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getHomeVod(current_site);
    }, [current_site, getHomeVod]);

    return (
        <div className={styles['vod-next-home']}>
            {loading ? (
                <Loading fullscreen description="加载中" />
            ) : (
                <>
                    {homeVodTypes?.length > 0 ? (
                        homeVodTypes.map((item, index) => {
                            return (
                                <div key={`${item}-${index.toString()}`} className={styles['vod-next-home-section']}>
                                    <div className={styles['vod-next-home-header']}>
                                        <div className={styles['vod-next-home-title']}>{item}</div>
                                        <div
                                            className={styles['vod-next-home-more']}
                                            onClick={() => {
                                                const typeData = homeVodData.find((mItem) => mItem.type_name === item);
                                                if (typeData) {
                                                    router.push(`/category?id=${typeData.type_id}&name=${item}&site=${current_site}`);
                                                }
                                            }}
                                        >
                                            更多
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <VodList
                                        dataSource={homeVodData.filter((mItem) => mItem.type_name === item)}
                                        onItemClick={(vod) => {
                                            router.push(`/detail?id=${encodeURIComponent(vod.vod_id as string)}&site=${current_site}`);
                                        }}
                                    ></VodList>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles['vod-next-home-empty']}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H20V16H4V4Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 20H16" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 16V20" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>暂无数据</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
