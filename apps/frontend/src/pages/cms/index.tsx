import { uniq } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useStyles } from './styles';

import Loading from '@/components/Loading';
import MediaList, { MediaListItem } from '@/components/MediaList';
import { homeVodApi } from '@/services';
import useSettingStore from '@/store/useSettingStore';
import { HomeVodData } from '@/types';

const CmsHomePage: React.FC = () => {
    const [homeVodData, setHomeVodData] = useState<HomeVodData[]>([]);
    const [homeVodTypes, setHomeVodTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { current_site, site_name, updateSetting } = useSettingStore();
    const { styles } = useStyles();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentSite = useMemo(() => searchParams.get('id') || '', [searchParams]);

    useEffect(() => {
        if (!currentSite && current_site) {
            navigate(`/cms?id=${encodeURIComponent(current_site)}&name=${encodeURIComponent(site_name || '')}`, { replace: true });
        }
    }, [currentSite, current_site, site_name, navigate]);

    useEffect(() => {
        if (currentSite && currentSite !== current_site) {
            updateSetting({ current_site: currentSite });
        }
    }, [currentSite, current_site, updateSetting]);

    const getHomeVod = useCallback(async (site: string) => {
        try {
            setLoading(true);
            setHomeVodData([]);
            const res = await homeVodApi(site);
            const { code, data } = res;
            if (code === 0) {
                setHomeVodData(data);
                setHomeVodTypes(uniq(data.map((item) => item.type_name)));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentSite) {
            getHomeVod(currentSite);
        } else {
            setLoading(false);
        }
    }, [currentSite, getHomeVod]);

    return (
        <div className={styles.home}>
            {loading ? (
                <Loading fullscreen description="加载中" />
            ) : homeVodTypes?.length > 0 ? (
                homeVodTypes.map((item, index) => {
                    return (
                        <div key={`${item}-${index.toString()}`} className={styles.section}>
                            <MediaList
                                title={item}
                                onMore={() => {
                                    const typeData = homeVodData.find((mItem) => mItem.type_name === item);
                                    if (typeData) {
                                        navigate(`/cms/category?id=${typeData.type_id}&name=${item}&site=${current_site}`);
                                    }
                                }}
                                items={homeVodData
                                    .filter((mItem) => mItem.type_name === item)
                                    .map(
                                        (vod): MediaListItem => ({
                                            id: vod.vod_id,
                                            title: vod.vod_name,
                                            posterUrl: vod.vod_pic,
                                            badge: vod.vod_remarks || undefined
                                        })
                                    )}
                                onItemClick={(media) => {
                                    window.open(`/detail/cms/${encodeURIComponent(String(media.id))}?site=${current_site}`, '_blank', 'noopener,noreferrer');
                                }}
                            />
                        </div>
                    );
                })
            ) : (
                <div className={styles.empty}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20V16H4V4Z" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 20H16" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16V20" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>暂无数据</span>
                </div>
            )}
        </div>
    );
};

export default CmsHomePage;
