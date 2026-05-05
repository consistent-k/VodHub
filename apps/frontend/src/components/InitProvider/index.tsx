import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Loading from '../Loading';

import useAppConfigStore from '@/store/useAppConfigStore';
import useSettingStore from '@/store/useSettingStore';
import { useVodSitesStore } from '@/store/useVodSitesStore';

export default function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized, hasError } = useVodSitesStore();
    const { vod_hub_api } = useSettingStore();
    const { tmdb_enabled, tmdb_api_token, isConfigLoaded, fetchConfig } = useAppConfigStore();

    const isTmdbMode = tmdb_enabled && !!tmdb_api_token;
    const isCmsMode = !!vod_hub_api;

    const navigate = useNavigate();
    const location = useLocation();

    // Fetch backend config on mount
    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // Redirect to settings if neither CMS nor TMDB is configured
    useEffect(() => {
        if (isConfigLoaded && !isTmdbMode && (!vod_hub_api || hasError)) {
            navigate('/setting', { replace: true });
        }
    }, [vod_hub_api, navigate, hasError, isTmdbMode, isConfigLoaded]);

    // Only fetch CMS types if CMS is configured
    useEffect(() => {
        if (isCmsMode && !isInitialized && location.pathname !== '/setting') {
            getVodTypes();
        }
    }, [getVodTypes, isInitialized, location.pathname, isCmsMode]);

    // Wait for backend config to load
    if (!isConfigLoaded && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    // Loading gate: only block on CMS initialization, TMDB needs no init
    if (isCmsMode && !isInitialized && !isTmdbMode && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!isTmdbMode && !vod_hub_api && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    return <>{children}</>;
}
