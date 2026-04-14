import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { Loading } from '@/components/ui/Loading';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

export default function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized, hasError } = useVodSitesStore();
    const { vod_hub_api } = useSettingStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!vod_hub_api || hasError) {
            navigate('/setting', { replace: true });
        }
    }, [vod_hub_api, navigate, hasError]);

    useEffect(() => {
        if (!isInitialized && location.pathname !== '/setting') {
            getVodTypes({
                force: false
            });
        }
    }, [getVodTypes, isInitialized, location.pathname]);

    if (!isInitialized && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!vod_hub_api && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    return <>{children}</>;
}
