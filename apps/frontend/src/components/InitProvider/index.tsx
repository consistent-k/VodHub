import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Loading from '../Loading';

import useAppConfigStore from '@/store/useAppConfigStore';
import useSettingStore from '@/store/useSettingStore';
import { useVodSitesStore } from '@/store/useVodSitesStore';

export default function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized, hasError } = useVodSitesStore();
    const { vod_hub_api } = useSettingStore();
    const { tmdb_enabled, isConfigLoaded, fetchConfig } = useAppConfigStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    useEffect(() => {
        if (isConfigLoaded && !tmdb_enabled && (!vod_hub_api || hasError)) {
            navigate('/setting', { replace: true });
        }
    }, [vod_hub_api, navigate, hasError, tmdb_enabled, isConfigLoaded]);

    useEffect(() => {
        if (!!vod_hub_api && !isInitialized && location.pathname !== '/setting') {
            getVodTypes();
        }
    }, [getVodTypes, isInitialized, location.pathname, vod_hub_api]);

    if (!isConfigLoaded && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!!vod_hub_api && !isInitialized && !tmdb_enabled && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!tmdb_enabled && !vod_hub_api && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    return <>{children}</>;
}
