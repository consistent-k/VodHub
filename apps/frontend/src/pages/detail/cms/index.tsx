import { Button, Empty } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { useStyles } from './styles';

import MediaInfo from '@/components/detail/MediaInfo';
import PlayerWithEpisodes from '@/components/detail/PlayerWithEpisodes';
import Loading from '@/components/Loading';
import { detailApi } from '@/services';
import type { DetailData } from '@/types';

const CmsDetailPage: React.FC = () => {
    const { vodId } = useParams<{ vodId: string }>();
    const [searchParams] = useSearchParams();
    const site = searchParams.get('site');
    const navigate = useNavigate();
    const { styles } = useStyles();

    const [detail, setDetail] = useState<DetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDetail = useCallback(async () => {
        if (!vodId || !site) return;
        setLoading(true);
        setError(false);
        try {
            const res = await detailApi(site, { id: decodeURIComponent(vodId) });
            const { code, data } = res;
            if (code === 0 && data.length > 0) {
                setDetail(data[0]);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [vodId, site]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    if (loading) {
        return <Loading fullscreen />;
    }

    if (error || !detail || !site) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                <Empty description="加载失败">
                    <Button type="primary" onClick={() => navigate('/home')}>
                        返回首页
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <PlayerWithEpisodes detail={detail} site={site} />

                <div className={styles.tabs}>
                    <MediaInfo detail={detail} />
                </div>
            </div>
        </div>
    );
};

export default CmsDetailPage;
