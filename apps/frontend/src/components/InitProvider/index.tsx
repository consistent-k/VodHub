import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import Loading from '../Loading';

import useAppConfigStore from '@/store/useAppConfigStore';
import { useVodSitesStore } from '@/store/useVodSitesStore';

export default function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized, hasError } = useVodSitesStore();
    const { tmdb_enabled, isConfigLoaded, fetchConfig } = useAppConfigStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    useEffect(() => {
        if (isConfigLoaded && !tmdb_enabled && hasError) {
            navigate('/setting', { replace: true });
        }
    }, [navigate, hasError, tmdb_enabled, isConfigLoaded]);

    useEffect(() => {
        if (!isInitialized && location.pathname !== '/setting') {
            getVodTypes();
        }
    }, [getVodTypes, isInitialized, location.pathname]);

    if (!isConfigLoaded && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!isInitialized && !tmdb_enabled && location.pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    return <>{children}</>;
}
